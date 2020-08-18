/*
 * @Date: 2020-05-25 17:02:07
 * @LastEditTime: 2020-08-18 09:56:54
 */
export const patternName = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;

export const patternPhone = /^((13[0-9])|(14[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))\d{8}$/;

// 16、身份证：(^\d{15}$)|(^\d{17}([0-9]|X|x)$)

// 17、匹配网址URL的正则表达式：[a-zA-z]+://[^s]*
export const patternUrl = /[a-zA-z]+:\/\/[^s]*/;

export const patternPrice = /^[]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
