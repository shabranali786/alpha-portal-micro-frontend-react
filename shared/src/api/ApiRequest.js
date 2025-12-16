const ApiRequest = {
  // Authentication
  auth: {
    login: "/login",
    logout: "/logout",
    updateProfile: "/profile/update",
  },

  // Profile
  profile: "/profile",

  // Leads Management
  leads: {
    list: "/leads",
    show: (id) => `/leads/${id}`,
    create: "/leads/create",
    update: (id) => `/leads/${id}/edit`,
    delete: (id) => `/leads/${id}/delete`,
    invoices: (leadId) => `/invoices?lead_id=${leadId}`,
    testList: "/leads/test",
    markTest: "/leads/mark-as-test",
    leadStatus: (leadId) => `leads/${leadId}/status`,
    leadNotes: (leadId) => `leads/${leadId}/notes`,
  },

  customers: {
    listLive: "/leads/customer",
    listTest: "/leads/customer/test",
  },

  // Users Management
  users: {
    list: "/users",
    show: (id) => `/users/${id}/show`,
    create: "/users/store",
    update: (id) => `/users/${id}/update`,
    delete: (id) => `/users/${id}/delete`,
    updatePermissions: (id) => `/users/${id}/update-permissions`,
    teams: (id) => `/teams/user/${id}`,
    fetchUserForAssignment: "/users/fetch-for-assignment",
  },

  // Roles Management
  roles: {
    list: "/roles",
    show: (id) => `/roles/${id}`,
    create: "/roles/store",
    update: (id) => `/roles/${id}/update`,
    delete: (id) => `/roles/${id}/delete`,
    updatePermissions: (id) => `/roles/${id}/update`,
  },

  // Permissions Management
  permissions: {
    list: "/permissions",
    all: "/permissions/all",
    create: "/permissions/store",
    update: (id) => `/permissions/${id}/update`,
    show: (id) => `/permissions/${id}`,
    delete: (id) => `/permissions/${id}/delete`,
  },

  // Teams Management
  teams: {
    list: "/teams",
    create: "/teams/store",
    update: (id) => `/teams/${id}/update`,
    show: (id) => `/teams/${id}`,
    delete: (id) => `/teams/${id}/delete`,
  },

  // Units Management
  units: {
    list: "/units",
    show: (id) => `/units/${id}/show`,
    create: "/units/store",
    update: (id) => `/units/${id}/update`,
    delete: (id) => `/units/${id}/delete`,
  },

  // Brands Management
  brands: {
    list: "/brands",
    show: (id) => `/brands/${id}`,
    create: "/brands/store",
    update: (id) => `/brands/${id}/update`,
    delete: (id) => `/brands/${id}/delete`,
    invoiceSettings: "/brands/invoice-settings",
    emailSettings: "/brands/email-settings",
  },

  // Merchants Management
  merchants: {
    list: "/merchants",
    show: (id) => `/merchants/${id}`,
    create: "/merchants/store",
    update: (id) => `/merchants/${id}/update`,
    delete: (id) => `/merchants/${id}/delete`,
  },
  MerchantMapping: {
    assign: "/merchant-mapping/assign",
  },
  merchantReports: {
    index: "/merchant-reports",
  },
  teamReports: {
    index: "/team-wise-report",
  },
  unitWiseReports: {
    index: "/unit-wise-report",
  },
  combinedSalesReports: {
    index: "/combined-sales-chargeback",
  },
  transactions: {
    list: "/transactions",
  },
  salesReports: {
    list: "/sales-reports",
    export: "/sales-reports/export",
  },
  invoices: {
    list: "/invoices",
    show: (id) => `/invoices/${id}/show`,
    create: "/invoices/create",
    update: (id) => `/invoices/${id}/edit`,
    delete: (id) => `/invoices/${id}/delete`,
  },
  officeLetters: {
    list: "/office-letters",
    show: (id) => `/office-letters/${id}/show`,
    create: "/office-letters/create",
    update: (id) => `/office-letters/${id}/edit`,
    delete: (id) => `/office-letters/${id}/delete`,
  },
  externalPayments: {
    list: "/external-payments",
    show: (id) => `/external-payments/${id}/show`,
    create: "/external-payments/create",
    update: (id) => `/external-payments/${id}/edit`,
    delete: (id) => `/external-payments/${id}/delete`,
  },
  unitReports: {
    list: "/unit-reports",
    teams: (unitId) => `/unit-reports/${unitId}/teams`,
    teamUsers: (unitId, teamId) =>
      `/unit-reports/${unitId}/teams/${teamId}/users`,
    userInvoices: (unitId, teamId, userId) =>
      `/unit-reports/${unitId}/teams/${teamId}/users/${userId}/invoices`,
    brands: (unitId) => `/unit-reports/${unitId}/brands`,
    brandWebOrders: (unitId, brandId) =>
      `/unit-reports/${unitId}/brands/${brandId}/web-orders`,
    leadInvoices: (leadId) => `/unit-reports/leads/${leadId}/invoices`,
  },
  chargebacks: {
    list: "/chargebacks",
    show: (id) => `/chargebacks/${id}/show`,
    create: "/chargebacks/create",
    update: (id) => `/chargebacks/${id}/edit`,
    delete: (id) => `/chargebacks/${id}/delete`,
  },
  ips: {
    list: "/ips",
    show: (id) => `/ips/${id}/show`,
    create: "/ips/create",
    update: (id) => `/ips/${id}/edit`,
    delete: (id) => `/ips/${id}/delete`,
  },
  chats: {
    list: "/chats",
    show: (id) => `/chats/${id}/show`,
    create: "/chats/create",
    update: (id) => `/chats/${id}/edit`,
    delete: (id) => `/chats/${id}/delete`,
  },
  expenses: {
    list: "/expenses",
    show: (id) => `/expenses/${id}/show`,
    create: "/expenses/create",
    update: (id) => `/expenses/${id}/edit`,
    delete: (id) => `/expenses/${id}/delete`,
  },
  emailConfigs: {
    list: "/email-configs",
    listByBrand: (brandId) => `/email-configs?brand_id=${brandId}`,
    show: (id) => `/email-configs/${id}/show`,
    create: "/email-configs/create",
    update: (id) => `/email-configs/${id}/update`,
    delete: (id) => `/email-configs/${id}/delete`,
    import: "/email-configs/import",
    logs: (id) => `/email-configs/${id}/logs`,
    sync: (id) => `/email-configs/${id}/sync`,
    syncStatus: (id) => `/email-configs/${id}/sync-status`,
    assignUsers: (id) => `/email-configs/${id}/assign-to-users`,
    unassignUsers: (id) => `/email-configs/${id}/unassign-from-users`,
    mailbox: (configId) => `/email-configs/${configId}/mailbox`,
    emailDetail: (configId, emailId) =>
      `/email-configs/${configId}/emails/${emailId}`,
    // sendEmail: (configId) => `/email-configs/${configId}/send`,
    // markAsRead: (configId, emailId) =>
    //   `/email-configs/${configId}/emails/${emailId}/read`,
  },
  leadEmails: {
    timeline: (leadId) => `/lead-emails/${leadId}/email/timeline`,
    conversation: (leadId, threadId) =>
      `/lead-emails/${leadId}/email/conversation/${threadId}`,
    send: (leadId) => `/lead-emails/${leadId}/email/send`,
  },
};

export default ApiRequest;
