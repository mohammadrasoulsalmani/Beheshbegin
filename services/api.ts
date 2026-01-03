import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

// تایپ‌های اصلی
export type Callback<T> = (data: T) => void;
export type FailCallback = (error: any) => void;
export type Params = Record<string, any>;

// تایپ‌های پاسخ API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// تایپ‌های برنامه شما
export interface User {
  id: string;
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
  balance: number;
  totalDonated: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  id: string;
  code: string;
  emotion: string;
  source: string;
  sourceLabel: {
    fa: string;
    en: string;
    ar: string;
  };
  reference: {
    fa: string;
    en: string;
    ar: string;
  };
  likes: number;
  usageCount: number;
  text: {
    fa: string;
    en: string;
    ar: string;
  };
  tags: string[];
  category?: string;
  isActive: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'DONATION' | 'WITHDRAWAL' | 'REFUND';
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'VERIFIED';
  authority: string;
  refId?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SentMessage {
  id: string;
  userId: string;
  messageId: string;
  toPhoneNumber: string;
  messageText: string;
  language: 'fa' | 'en' | 'ar';
  status: 'SENT' | 'DELIVERED' | 'FAILED' | 'PENDING';
  cost: number;
  sentAt: string;
  deliveredAt?: string;
}

export interface AIMessageRequest {
  emotion: string;
  context?: string;
  language?: 'fa' | 'en' | 'ar';
}

export interface AIMessageResponse {
  message: string;
  emotion: string;
  language: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// تنظیمات پایه
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3003/api';

/**
 * مدیریت خطاهای API
 */
const handleError = (error: AxiosError, fail?: FailCallback) => {
  let errorData = {
    status: 0,
    message: 'خطای ناشناخته',
    data: null as any
  };

  if (error.response) {
    errorData = {
      status: error.response.status,
      message: (error.response.data as any)?.error || 
               (error.response.data as any)?.message || 
               `خطای سرور: ${error.response.status}`,
      data: error.response.data
    };
  } else if (error.request) {
    errorData = {
      status: 0,
      message: 'خطای شبکه - پاسخی از سرور دریافت نشد',
      data: null
    };
  } else {
    errorData = {
      status: 0,
      message: error.message || 'خطای درخواست',
      data: null
    };
  }

  console.error('API Error:', errorData);

  if (typeof fail === 'function') {
    fail(errorData);
  }

  return errorData;
};

/**
 * هدرهای پیش‌فرض
 */
const getHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // اگر توکن دارید، اینجا اضافه کنید
  // const token = localStorage.getItem('token');
  // if (token) {
  //   headers.Authorization = `Bearer ${token}`;
  // }

  return headers;
};

/**
 * متد GET
 */
export const get = async <T>(
  url: string,
  params: Params = {},
  callback?: Callback<T>,
  fail?: FailCallback
): Promise<T | void> => {
  try {
    const config: AxiosRequestConfig = {
      params,
      headers: getHeaders(),
      timeout: 15000
    };

    const response: AxiosResponse<ApiResponse<T>> = await axios.get(`${baseURL}${url}`, config);
    
    if (response.data.success && callback) {
      callback(response.data.data as T);
      return response.data.data;
    } else if (!response.data.success && fail) {
      fail(response.data.error || 'خطای سرور');
    }

    return response.data.data;
  } catch (error) {
    const errorData = handleError(error as AxiosError, fail);
    throw errorData;
  }
};

/**
 * متد POST
 */
export const post = async <T>(
  url: string,
  data: Params = {},
  callback?: Callback<T>,
  fail?: FailCallback
): Promise<T | void> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await axios.post(`${baseURL}${url}`, data, {
      headers: getHeaders(),
      timeout: 15000
    });
    
    if (response.data.success && callback) {
      callback(response.data.data as T);
      return response.data.data;
    } else if (!response.data.success && fail) {
      fail(response.data.error || 'خطای سرور');
    }

    return response.data.data;
  } catch (error) {
    const errorData = handleError(error as AxiosError, fail);
    throw errorData;
  }
};

/**
 * متد PUT
 */
export const put = async <T>(
  url: string,
  data: Params = {},
  callback?: Callback<T>,
  fail?: FailCallback
): Promise<T | void> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await axios.put(`${baseURL}${url}`, data, {
      headers: getHeaders(),
      timeout: 15000
    });
    
    if (response.data.success && callback) {
      callback(response.data.data as T);
      return response.data.data;
    } else if (!response.data.success && fail) {
      fail(response.data.error || 'خطای سرور');
    }

    return response.data.data;
  } catch (error) {
    const errorData = handleError(error as AxiosError, fail);
    throw errorData;
  }
};

/**
 * متد DELETE
 */
export const del = async <T>(
  url: string,
  data: Params = {},
  callback?: Callback<T>,
  fail?: FailCallback
): Promise<T | void> => {
  try {
    const config: AxiosRequestConfig = {
      headers: getHeaders(),
      data,
      timeout: 15000
    };

    const response: AxiosResponse<ApiResponse<T>> = await axios.delete(`${baseURL}${url}`, config);
    
    if (response.data.success && callback) {
      callback(response.data.data as T);
      return response.data.data;
    } else if (!response.data.success && fail) {
      fail(response.data.error || 'خطای سرور');
    }

    return response.data.data;
  } catch (error) {
    const errorData = handleError(error as AxiosError, fail);
    throw errorData;
  }
};

// ==================== API های مخصوص برنامه شما ====================

/**
 * API کاربران
 */
export const userAPI = {
  // ثبت‌نام کاربر
  // در بخش userAPI:
  register: (phoneNumber: string) => 
    post<{ user: User }>('/users/register', { phoneNumber }),

  // دریافت اطلاعات کاربر
  getUser: (userId: string) => 
    get<{ user: User; stats: any }>(`/users/${userId}`),

  // به‌روزرسانی پروفایل
  updateProfile: (userId: string, data: Partial<User>) => 
    put<User>(`/users/${userId}`, data),

  // ارسال پیام به شماره دیگر
  sendMessage: (userId: string, toPhoneNumber: string, messageId: string, language: 'fa' | 'en' | 'ar' = 'fa') => 
    post<{ sentMessage: SentMessage; remainingBalance: number; smsResult: any }>('/users/send-message', {
      userId,
      toPhoneNumber,
      messageId,
      language
    }),

  // دریافت تاریخچه پیام‌های ارسال شده
  getSentMessages: (userId: string, params: { page?: number; limit?: number; status?: string } = {}) => 
    get<{ data: SentMessage[]; pagination: any }>(`/users/${userId}/sent-messages`, params),
};

/**
 * API پیام‌ها
 */
// api.ts - بخش اصلاح شده messageAPI
export const messageAPI = {
  // دریافت لیست پیام‌ها
  getMessages: (params: {
    emotion?: string;
    source?: string;
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}) => 
    get<Message[]>('/messages', params),

  // دریافت پیام تصادفی
  getRandomMessage: (params: { emotion?: string; source?: string; language?: string } = {}) => 
    get<Message>('/messages/random', params),

  // دریافت آمار
  getStats: () => 
    get<any>('/messages/stats'),

  // ایجاد پیام جدید
  createMessage: (data: Partial<Message>) => 
    post<Message>('/messages', data),

  // لایک کردن پیام
  likeMessage: (messageId: string) => 
    post<{ likes: number }>(`/messages/${messageId}/like`, {}),
};

/**
 * API تراکنش‌ها
 */
export const transactionAPI = {
  // ایجاد درخواست پرداخت
  createPayment: (userId: string, amount: number, description?: string) => 
    post<{ transactionId: string; authority: string; paymentURL: string }>('/transactions/payment', {
      userId,
      amount,
      description
    }),

  // دریافت تاریخچه تراکنش‌های کاربر
  getUserTransactions: (userId: string, params: { page?: number; limit?: number; status?: string } = {}) => 
    get<{ data: Transaction[]; pagination: any }>(`/transactions/user/${userId}`, params),

  // دریافت تراکنش توسط authority
  getTransactionByAuthority: (authority: string) => 
    get<Transaction>(`/transactions/authority/${authority}`),
};

/**
 * API هوش مصنوعی
 */
export const aiAPI = {
  // تولید پیام توسط AI
  generateMessage: (data: AIMessageRequest) => 
    post<AIMessageResponse>('/ai/generate', data),

  // تحلیل احساس از متن
  analyzeEmotion: (text: string) => 
    post<{ detectedEmotion: string; suggestedMessages: Message[] }>('/ai/analyze', { text }),

  // ترکیب چند پیام
  combineMessages: (messageIds: string[], theme?: string, language: 'fa' | 'en' | 'ar' = 'fa') => 
    post<{ combinedMessage: string; originalMessages: Message[]; language: string }>('/ai/combine', {
      messageIds,
      theme,
      language
    }),
};

/**
 * API وضعیت سیستم
 */
export const systemAPI = {
  // بررسی وضعیت سلامت
  health: () => 
    get<{ status: string; timestamp: string; uptime: number; database: string }>('/health'),
};

// ==================== Wrapper برای استفاده راحت‌تر ====================

/**
 * Wrapper برای استفاده در کامپوننت‌های React
 */
export const api = {
  // متدهای اصلی
  get: <T>(url: string, params?: Params) => get<T>(url, params),
  post: <T>(url: string, data?: Params) => post<T>(url, data),
  put: <T>(url: string, data?: Params) => put<T>(url, data),
  delete: <T>(url: string, data?: Params) => del<T>(url, data),

  // API های مخصوص
  users: userAPI,
  messages: messageAPI,
  transactions: transactionAPI,
  ai: aiAPI,
  system: systemAPI,

  // Helper برای ارسال درخواست با Promise
  request: async <T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    data?: Params
  ): Promise<T> => {
    try {
      switch (method) {
        case 'GET':
          return (await get<T>(url, data)) as T;
        case 'POST':
          return (await post<T>(url, data)) as T;
        case 'PUT':
          return (await put<T>(url, data)) as T;
        case 'DELETE':
          return (await del<T>(url, data)) as T;
        default:
          throw new Error(`Method ${method} not supported`);
      }
    } catch (error) {
      throw error;
    }
  },
};

// Export default برای backward compatibility
export default api;