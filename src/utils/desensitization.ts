/**
 * 脱敏工具函数
 * 用于保护个人隐私信息
 */

/**
 * 身份证号脱敏
 * 格式：前6位 + **** + 后4位
 * 例如：370822****1234
 */
export const desensitizeIdCard = (idCard: string): string => {
  if (!idCard || idCard.length < 10) {
    return idCard;
  }
  return `${idCard.substring(0, 6)}****${idCard.substring(idCard.length - 4)}`;
};

/**
 * 手机号脱敏
 * 格式：前3位 + **** + 后4位
 * 例如：138****1234
 */
export const desensitizePhone = (phone: string): string => {
  if (!phone || phone.length < 7) {
    return phone;
  }
  return `${phone.substring(0, 3)}****${phone.substring(phone.length - 4)}`;
};

/**
 * 座机号脱敏
 * 格式：区号 + **** + 后4位
 * 例如：0537****1234
 */
export const desensitizeLandline = (landline: string): string => {
  if (!landline || landline.length < 8) {
    return landline;
  }
  // 座机号通常是区号(4位) + 号码(7-8位)
  if (landline.startsWith('0') && landline.length >= 11) {
    // 区号是4位的情况
    return `${landline.substring(0, 4)}****${landline.substring(landline.length - 4)}`;
  } else if (landline.startsWith('0') && landline.length >= 10) {
    // 区号是3位的情况
    return `${landline.substring(0, 3)}****${landline.substring(landline.length - 4)}`;
  } else {
    // 其他情况，保留前3位和后4位
    return `${landline.substring(0, 3)}****${landline.substring(landline.length - 4)}`;
  }
};

/**
 * 通用电话号码脱敏
 * 自动识别手机号和座机号并应用相应的脱敏规则
 */
export const desensitizePhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) {
    return phoneNumber;
  }
  
  // 移除所有非数字字符
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  // 判断是手机号还是座机号
  if (cleanNumber.length === 11 && cleanNumber.startsWith('1')) {
    // 手机号
    return desensitizePhone(cleanNumber);
  } else if (cleanNumber.length >= 10) {
    // 座机号
    return desensitizeLandline(cleanNumber);
  } else {
    // 其他情况，保持原样
    return phoneNumber;
  }
};

/**
 * 姓名脱敏
 * 格式：姓氏 + *
 * 例如：张*
 */
export const desensitizeName = (name: string): string => {
  if (!name || name.length < 2) {
    return name;
  }
  return `${name.charAt(0)}*`;
};

/**
 * 地址脱敏
 * 格式：省市区 + 详细地址脱敏
 * 例如：山东省济宁市汶上县中都街道****
 */
export const desensitizeAddress = (address: string): string => {
  if (!address) {
    return address;
  }
  
  // 如果地址包含"栋"、"单元"、"室"等具体信息，进行脱敏
  if (address.includes('栋') || address.includes('单元') || address.includes('室')) {
    // 找到最后一个数字的位置
    const lastNumberIndex = address.search(/\d+[栋单元室]/);
    if (lastNumberIndex !== -1) {
      return `${address.substring(0, lastNumberIndex)}****`;
    }
  }
  
  // 如果地址长度超过15个字符，进行脱敏
  if (address.length > 15) {
    return `${address.substring(0, 15)}****`;
  }
  
  return address;
};

/**
 * 银行卡号脱敏
 * 格式：前6位 + **** + 后4位
 * 例如：622202****1234
 */
export const desensitizeBankCard = (cardNumber: string): string => {
  if (!cardNumber || cardNumber.length < 10) {
    return cardNumber;
  }
  return `${cardNumber.substring(0, 6)}****${cardNumber.substring(cardNumber.length - 4)}`;
};

/**
 * 邮箱脱敏
 * 格式：用户名前2位 + *** + @域名
 * 例如：ab***@example.com
 */
export const desensitizeEmail = (email: string): string => {
  if (!email || !email.includes('@')) {
    return email;
  }
  
  const [username, domain] = email.split('@');
  if (username.length <= 2) {
    return email;
  }
  
  return `${username.substring(0, 2)}***@${domain}`;
};
