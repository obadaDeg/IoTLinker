-- =====================================================
-- IoTLinker Enterprise - Clerk Integration
-- Version: 1.0
-- Description: Functions and triggers for Clerk <-> Supabase user sync
-- =====================================================

-- =====================================================
-- CLERK WEBHOOK PROCESSING FUNCTION
-- =====================================================

-- Function to handle Clerk user creation webhook
CREATE OR REPLACE FUNCTION handle_clerk_user_created(
    p_clerk_user_id VARCHAR,
    p_email VARCHAR,
    p_full_name VARCHAR DEFAULT NULL,
    p_avatar_url TEXT DEFAULT NULL,
    p_phone_number VARCHAR DEFAULT NULL,
    p_tenant_id UUID DEFAULT NULL,
    p_email_verified BOOLEAN DEFAULT false
)
RETURNS UUID AS $$
DECLARE
    new_user_id UUID;
    default_tenant_id UUID;
BEGIN
    -- If no tenant_id provided, try to find or create a default tenant
    IF p_tenant_id IS NULL THEN
        -- Look for existing tenant or create default
        SELECT id INTO default_tenant_id
        FROM tenants
        WHERE subdomain = 'default'
        LIMIT 1;

        IF default_tenant_id IS NULL THEN
            -- Create default organization and tenant if they don't exist
            INSERT INTO organizations (name, slug, status)
            VALUES ('Default Organization', 'default', 'active')
            ON CONFLICT (slug) DO NOTHING
            RETURNING id INTO default_tenant_id;

            INSERT INTO tenants (organization_id, name, subdomain, active)
            VALUES (
                default_tenant_id,
                'Default Tenant',
                'default',
                true
            )
            ON CONFLICT (subdomain) DO UPDATE
            SET active = true
            RETURNING id INTO default_tenant_id;
        END IF;

        p_tenant_id := default_tenant_id;
    END IF;

    -- Insert or update user
    INSERT INTO users (
        clerk_user_id,
        tenant_id,
        email,
        full_name,
        avatar_url,
        phone_number,
        email_verified,
        status
    )
    VALUES (
        p_clerk_user_id,
        p_tenant_id,
        p_email,
        p_full_name,
        p_avatar_url,
        p_phone_number,
        p_email_verified,
        'active'
    )
    ON CONFLICT (clerk_user_id) DO UPDATE
    SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        avatar_url = EXCLUDED.avatar_url,
        phone_number = EXCLUDED.phone_number,
        email_verified = EXCLUDED.email_verified,
        updated_at = NOW()
    RETURNING id INTO new_user_id;

    -- Assign default "End User" role if this is a new user
    IF NOT EXISTS (
        SELECT 1 FROM user_roles WHERE user_id = new_user_id
    ) THEN
        INSERT INTO user_roles (user_id, role_id)
        SELECT new_user_id, id
        FROM roles
        WHERE name = 'End User' AND tenant_id IS NULL
        LIMIT 1;
    END IF;

    -- Log audit event
    INSERT INTO audit_logs (
        tenant_id,
        user_id,
        action,
        resource_type,
        resource_id,
        status
    )
    VALUES (
        p_tenant_id,
        new_user_id,
        'create',
        'user',
        new_user_id,
        'success'
    );

    RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle Clerk user update webhook
CREATE OR REPLACE FUNCTION handle_clerk_user_updated(
    p_clerk_user_id VARCHAR,
    p_email VARCHAR DEFAULT NULL,
    p_full_name VARCHAR DEFAULT NULL,
    p_avatar_url TEXT DEFAULT NULL,
    p_phone_number VARCHAR DEFAULT NULL,
    p_email_verified BOOLEAN DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    user_uuid UUID;
BEGIN
    -- Find user by Clerk ID
    SELECT id INTO user_uuid
    FROM users
    WHERE clerk_user_id = p_clerk_user_id;

    IF user_uuid IS NULL THEN
        RAISE EXCEPTION 'User with clerk_user_id % not found', p_clerk_user_id;
    END IF;

    -- Update user fields (only non-null values)
    UPDATE users
    SET
        email = COALESCE(p_email, email),
        full_name = COALESCE(p_full_name, full_name),
        avatar_url = COALESCE(p_avatar_url, avatar_url),
        phone_number = COALESCE(p_phone_number, phone_number),
        email_verified = COALESCE(p_email_verified, email_verified),
        updated_at = NOW()
    WHERE id = user_uuid;

    -- Log audit event
    INSERT INTO audit_logs (
        tenant_id,
        user_id,
        action,
        resource_type,
        resource_id,
        status
    )
    SELECT
        tenant_id,
        user_uuid,
        'update',
        'user',
        user_uuid,
        'success'
    FROM users
    WHERE id = user_uuid;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle Clerk user deletion webhook
CREATE OR REPLACE FUNCTION handle_clerk_user_deleted(
    p_clerk_user_id VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
    user_uuid UUID;
    user_tenant_id UUID;
BEGIN
    -- Find user by Clerk ID
    SELECT id, tenant_id INTO user_uuid, user_tenant_id
    FROM users
    WHERE clerk_user_id = p_clerk_user_id;

    IF user_uuid IS NULL THEN
        RAISE EXCEPTION 'User with clerk_user_id % not found', p_clerk_user_id;
    END IF;

    -- Log audit event before deletion
    INSERT INTO audit_logs (
        tenant_id,
        user_id,
        action,
        resource_type,
        resource_id,
        status
    )
    VALUES (
        user_tenant_id,
        user_uuid,
        'delete',
        'user',
        user_uuid,
        'success'
    );

    -- Soft delete by setting status to inactive (preserves audit trail)
    UPDATE users
    SET
        status = 'inactive',
        updated_at = NOW()
    WHERE id = user_uuid;

    -- Alternatively, hard delete (uncomment if preferred):
    -- DELETE FROM users WHERE id = user_uuid;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update last login time
CREATE OR REPLACE FUNCTION update_user_last_login(
    p_clerk_user_id VARCHAR
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE users
    SET last_login = NOW()
    WHERE clerk_user_id = p_clerk_user_id;

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- HELPER FUNCTIONS FOR USER MANAGEMENT
-- =====================================================

-- Function to get user by Clerk ID
CREATE OR REPLACE FUNCTION get_user_by_clerk_id(
    p_clerk_user_id VARCHAR
)
RETURNS TABLE(
    id UUID,
    tenant_id UUID,
    email VARCHAR,
    full_name VARCHAR,
    avatar_url TEXT,
    status VARCHAR,
    roles JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.id,
        u.tenant_id,
        u.email,
        u.full_name,
        u.avatar_url,
        u.status,
        COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    'role_id', r.id,
                    'role_name', r.name,
                    'permissions', r.permissions
                )
            ) FILTER (WHERE r.id IS NOT NULL),
            '[]'::jsonb
        ) AS roles
    FROM users u
    LEFT JOIN user_roles ur ON ur.user_id = u.id
    LEFT JOIN roles r ON r.id = ur.role_id
    WHERE u.clerk_user_id = p_clerk_user_id
    GROUP BY u.id, u.tenant_id, u.email, u.full_name, u.avatar_url, u.status;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to assign role to user
CREATE OR REPLACE FUNCTION assign_role_to_user(
    p_user_id UUID,
    p_role_name VARCHAR,
    p_assigned_by UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    role_uuid UUID;
    user_tenant_id UUID;
BEGIN
    -- Get user's tenant
    SELECT tenant_id INTO user_tenant_id
    FROM users
    WHERE id = p_user_id;

    IF user_tenant_id IS NULL THEN
        RAISE EXCEPTION 'User % not found', p_user_id;
    END IF;

    -- Find role (prefer tenant-specific, fall back to system role)
    SELECT id INTO role_uuid
    FROM roles
    WHERE name = p_role_name
        AND (tenant_id = user_tenant_id OR tenant_id IS NULL)
    ORDER BY tenant_id NULLS LAST
    LIMIT 1;

    IF role_uuid IS NULL THEN
        RAISE EXCEPTION 'Role % not found', p_role_name;
    END IF;

    -- Assign role
    INSERT INTO user_roles (user_id, role_id, assigned_by)
    VALUES (p_user_id, role_uuid, p_assigned_by)
    ON CONFLICT (user_id, role_id) DO NOTHING;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to remove role from user
CREATE OR REPLACE FUNCTION remove_role_from_user(
    p_user_id UUID,
    p_role_name VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
    role_uuid UUID;
BEGIN
    -- Find role
    SELECT id INTO role_uuid
    FROM roles
    WHERE name = p_role_name;

    IF role_uuid IS NULL THEN
        RAISE EXCEPTION 'Role % not found', p_role_name;
    END IF;

    -- Remove role assignment
    DELETE FROM user_roles
    WHERE user_id = p_user_id AND role_id = role_uuid;

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- CLERK METADATA SYNC
-- =====================================================

-- Function to sync Clerk public metadata to Supabase
-- This can be called from your backend when Clerk metadata changes
CREATE OR REPLACE FUNCTION sync_clerk_metadata(
    p_clerk_user_id VARCHAR,
    p_tenant_id UUID DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE users
    SET
        tenant_id = COALESCE(p_tenant_id, tenant_id),
        profile = profile || p_metadata,
        updated_at = NOW()
    WHERE clerk_user_id = p_clerk_user_id;

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON FUNCTION handle_clerk_user_created IS 'Process Clerk user.created webhook event';
COMMENT ON FUNCTION handle_clerk_user_updated IS 'Process Clerk user.updated webhook event';
COMMENT ON FUNCTION handle_clerk_user_deleted IS 'Process Clerk user.deleted webhook event';
COMMENT ON FUNCTION update_user_last_login IS 'Update user last_login timestamp on authentication';
COMMENT ON FUNCTION get_user_by_clerk_id IS 'Retrieve user details including roles by Clerk ID';
COMMENT ON FUNCTION assign_role_to_user IS 'Assign a role to a user';
COMMENT ON FUNCTION remove_role_from_user IS 'Remove a role from a user';
COMMENT ON FUNCTION sync_clerk_metadata IS 'Sync Clerk metadata to Supabase user profile';
