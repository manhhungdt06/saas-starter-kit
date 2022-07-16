import type { Role } from "types";
import type { Tenant } from "@prisma/client";
import { prisma } from "@lib/prisma";

const getTenants = async (userId: string | null): Promise<Tenant[] | null> => {
  if (userId === null) {
    return null;
  }

  return await prisma.tenant.findMany({
    where: {
      users: {
        some: {
          userId,
        },
      },
    },
  });
};

const getTenant = async (key: { id: string } | { slug: string }) => {
  return await prisma.tenant.findUnique({
    where: key,
  });
};

const getTenantMembers = async (slug: string) => {
  return await prisma.tenantUser.findMany({
    where: {
      tenant: {
        slug,
      },
    },
    include: {
      user: true,
    },
  });
};

const addUser = async (params: {
  userId: string;
  tenantId: string;
  role: Role;
}) => {
  const { userId, tenantId, role } = params;

  return await prisma.tenantUser.create({
    data: {
      userId,
      tenantId,
      role,
    },
  });
};

const tenants = {
  getTenants,
  getTenantMembers,
  addUser,
  getTenant,
};

export default tenants;
