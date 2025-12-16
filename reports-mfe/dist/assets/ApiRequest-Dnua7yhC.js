import { importShared } from './__federation_fn_import-BFo6b6m_.js';

const React$1 = await importShared('react');

var DefaultContext = {
  color: undefined,
  size: undefined,
  className: undefined,
  style: undefined,
  attr: undefined
};
var IconContext = React$1.createContext && /*#__PURE__*/React$1.createContext(DefaultContext);

var _excluded = ["attr", "size", "title"];
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), true).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const React = await importShared('react');
function Tree2Element(tree) {
  return tree && tree.map((node, i) => /*#__PURE__*/React.createElement(node.tag, _objectSpread({
    key: i
  }, node.attr), Tree2Element(node.child)));
}
function GenIcon(data) {
  return props => /*#__PURE__*/React.createElement(IconBase, _extends({
    attr: _objectSpread({}, data.attr)
  }, props), Tree2Element(data.child));
}
function IconBase(props) {
  var elem = conf => {
    var {
        attr,
        size,
        title
      } = props,
      svgProps = _objectWithoutProperties(props, _excluded);
    var computedSize = size || conf.size || "1em";
    var className;
    if (conf.className) className = conf.className;
    if (props.className) className = (className ? className + " " : "") + props.className;
    return /*#__PURE__*/React.createElement("svg", _extends({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, conf.attr, attr, svgProps, {
      className: className,
      style: _objectSpread(_objectSpread({
        color: props.color || conf.color
      }, conf.style), props.style),
      height: computedSize,
      width: computedSize,
      xmlns: "http://www.w3.org/2000/svg"
    }), title && /*#__PURE__*/React.createElement("title", null, title), props.children);
  };
  return IconContext !== undefined ? /*#__PURE__*/React.createElement(IconContext.Consumer, null, conf => elem(conf)) : elem(DefaultContext);
}

// THIS FILE IS AUTO GENERATED
function BsFillPeopleFill (props) {
  return GenIcon({"attr":{"fill":"currentColor","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"},"child":[]}]})(props);
}function BsArrowRepeat (props) {
  return GenIcon({"attr":{"fill":"currentColor","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9"},"child":[]},{"tag":"path","attr":{"fillRule":"evenodd","d":"M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"},"child":[]}]})(props);
}function BsCashStack (props) {
  return GenIcon({"attr":{"fill":"currentColor","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4"},"child":[]},{"tag":"path","attr":{"d":"M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z"},"child":[]}]})(props);
}function BsChevronDown (props) {
  return GenIcon({"attr":{"fill":"currentColor","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"fillRule":"evenodd","d":"M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"},"child":[]}]})(props);
}function BsCurrencyDollar (props) {
  return GenIcon({"attr":{"fill":"currentColor","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73z"},"child":[]}]})(props);
}function BsFileEarmarkText (props) {
  return GenIcon({"attr":{"fill":"currentColor","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"},"child":[]},{"tag":"path","attr":{"d":"M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"},"child":[]}]})(props);
}function BsFilter (props) {
  return GenIcon({"attr":{"fill":"currentColor","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"},"child":[]}]})(props);
}function BsGraphUpArrow (props) {
  return GenIcon({"attr":{"fill":"currentColor","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"fillRule":"evenodd","d":"M0 0h1v15h15v1H0zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5"},"child":[]}]})(props);
}function BsGraphUp (props) {
  return GenIcon({"attr":{"fill":"currentColor","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"fillRule":"evenodd","d":"M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07"},"child":[]}]})(props);
}function BsPieChart (props) {
  return GenIcon({"attr":{"fill":"currentColor","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M7.5 1.018a7 7 0 0 0-4.79 11.566L7.5 7.793zm1 0V7.5h6.482A7 7 0 0 0 8.5 1.018M14.982 8.5H8.207l-4.79 4.79A7 7 0 0 0 14.982 8.5M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8"},"child":[]}]})(props);
}function BsReceiptCutoff (props) {
  return GenIcon({"attr":{"fill":"currentColor","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5M11.5 4a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1z"},"child":[]},{"tag":"path","attr":{"d":"M2.354.646a.5.5 0 0 0-.801.13l-.5 1A.5.5 0 0 0 1 2v13H.5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1H15V2a.5.5 0 0 0-.053-.224l-.5-1a.5.5 0 0 0-.8-.13L13 1.293l-.646-.647a.5.5 0 0 0-.708 0L11 1.293l-.646-.647a.5.5 0 0 0-.708 0L9 1.293 8.354.646a.5.5 0 0 0-.708 0L7 1.293 6.354.646a.5.5 0 0 0-.708 0L5 1.293 4.354.646a.5.5 0 0 0-.708 0L3 1.293zm-.217 1.198.51.51a.5.5 0 0 0 .707 0L4 1.707l.646.647a.5.5 0 0 0 .708 0L6 1.707l.646.647a.5.5 0 0 0 .708 0L8 1.707l.646.647a.5.5 0 0 0 .708 0L10 1.707l.646.647a.5.5 0 0 0 .708 0L12 1.707l.646.647a.5.5 0 0 0 .708 0l.509-.51.137.274V15H2V2.118z"},"child":[]}]})(props);
}function BsWallet2 (props) {
  return GenIcon({"attr":{"fill":"currentColor","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z"},"child":[]}]})(props);
}

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

export { ApiRequest as A, BsCurrencyDollar as B, BsFillPeopleFill as a, BsGraphUpArrow as b, BsWallet2 as c, BsChevronDown as d, BsFilter as e, BsArrowRepeat as f, BsCashStack as g, BsGraphUp as h, BsPieChart as i, BsReceiptCutoff as j, BsFileEarmarkText as k };
