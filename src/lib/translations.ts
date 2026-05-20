// Translation dictionaries for English and Urdu
const translations: Record<string, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.search': 'Search',
    'nav.jobs': 'Jobs',
    'nav.messages': 'Messages',
    'nav.profile': 'Profile',
    'nav.dashboard': 'Dashboard',
    'nav.requests': 'Requests',
    'nav.myJobs': 'My Jobs',

    // Home
    'home.hello': 'Hello',
    'home.services': 'Services',
    'home.exploreAll': 'Explore All',
    'home.availableNear': 'Available Near You',
    'home.topRated': 'Top Rated',
    'home.searchPlaceholder': 'Tell us what you need... (e.g. I need an electrician)',
    'home.postCustomJob': 'Post Custom Job',
    'home.featuredOffer': 'Featured Offer',
    'home.cantExplain': "Can't explain it properly?",
    'home.sendVoice': 'Just send a voice note or post a custom request for bidders.',

    // Booking
    'book.checkout': 'Checkout',
    'book.serviceLocation': 'Service Location',
    'book.change': 'Change',
    'book.scheduleSelection': 'Schedule Selection',
    'book.date': 'Date',
    'book.time': 'Time',
    'book.paymentMethod': 'Payment Method',
    'book.serviceFee': 'Service Fee',
    'book.platformFee': 'Platform Fee',
    'book.totalAmount': 'Total Amount',
    'book.confirmBooking': 'Confirm Booking',
    'book.trustGuarantee': 'Helper Trust Guarantee Included',
    'book.bookingConfirmed': 'Booking Confirmed!',
    'book.helperDispatched': 'Your helper is being dispatched.',
    'book.liveTrack': 'Live Track Helper',
    'book.backHome': 'Back to Home',
    'book.promoCode': 'Promo Code',
    'book.applyPromo': 'Apply',
    'book.discount': 'Discount',

    // Jobs
    'jobs.title': 'My Jobs',
    'jobs.active': 'Active',
    'jobs.past': 'Past',
    'jobs.noActive': 'No active jobs.',
    'jobs.noPast': 'No past jobs.',
    'jobs.cancelRequest': 'Cancel Request',
    'jobs.cancelBooking': 'Cancel Booking',
    'jobs.message': 'Message',
    'jobs.leaveReview': 'Leave a Review',
    'jobs.submitReview': 'Submit Review',
    'jobs.confirmCancel': 'Confirm Cancellation',
    'jobs.cancelReason': 'Reason for Cancellation',

    // Profile
    'profile.editProfile': 'Edit Profile',
    'profile.settings': 'Settings',
    'profile.payments': 'Payment Methods',
    'profile.addresses': 'Saved Addresses',
    'profile.favorites': 'Favorites',
    'profile.help': 'Help & Support',
    'profile.logout': 'Logout',

    // Settings
    'settings.title': 'Settings',
    'settings.notifications': 'Notifications',
    'settings.password': 'Password & Security',
    'settings.privacy': 'Privacy Settings',
    'settings.language': 'App Language',
    'settings.darkMode': 'Dark Mode',
    'settings.deleteAccount': 'Delete My Account',
    'settings.serviceSettings': 'Service Settings',

    // Cart
    'cart.title': 'My Cart',
    'cart.empty': 'Your cart is empty',
    'cart.browseHelpers': 'Browse Helpers',
    'cart.proceedCheckout': 'Proceed to Checkout',
    'cart.items': 'items',
    'cart.addToCart': 'Add to Cart',

    // Admin
    'admin.title': 'Helper Admin Portal',
    'admin.overview': 'Overview',
    'admin.workers': 'Workers',
    'admin.users': 'Users',
    'admin.jobsOrders': 'Jobs/Orders',
    'admin.analytics': 'Analytics',
    'admin.disputes': 'Disputes',

    // General
    'general.loading': 'Loading...',
    'general.error': 'An error occurred',
    'general.retry': 'Retry',
    'general.save': 'Save',
    'general.cancel': 'Cancel',
    'general.confirm': 'Confirm',
    'general.back': 'Back',
    'general.next': 'Next',
    'general.done': 'Done',
    'general.perHour': 'Per Hour',
    'general.rating': 'Rating',
    'general.kmAway': 'KM Away',
  },
  ur: {
    // Navigation
    'nav.home': 'ہوم',
    'nav.search': 'تلاش',
    'nav.jobs': 'کام',
    'nav.messages': 'پیغامات',
    'nav.profile': 'پروفائل',
    'nav.dashboard': 'ڈیش بورڈ',
    'nav.requests': 'درخواستیں',
    'nav.myJobs': 'میرے کام',

    // Home
    'home.hello': 'السلام علیکم',
    'home.services': 'خدمات',
    'home.exploreAll': 'سب دیکھیں',
    'home.availableNear': 'آپ کے قریب دستیاب',
    'home.topRated': 'بہترین درجہ بندی',
    'home.searchPlaceholder': 'اپنی ضرورت بتائیں... (مثال: مجھے الیکٹریشن چاہیے)',
    'home.postCustomJob': 'کسٹم جاب پوسٹ کریں',
    'home.featuredOffer': 'خصوصی پیشکش',
    'home.cantExplain': 'صحیح بیان نہیں کر سکتے؟',
    'home.sendVoice': 'صرف وائس نوٹ بھیجیں یا بولی لگانے والوں کے لیے کسٹم درخواست پوسٹ کریں۔',

    // Booking
    'book.checkout': 'چیک آؤٹ',
    'book.serviceLocation': 'سروس کا مقام',
    'book.change': 'تبدیل کریں',
    'book.scheduleSelection': 'شیڈول منتخب کریں',
    'book.date': 'تاریخ',
    'book.time': 'وقت',
    'book.paymentMethod': 'ادائیگی کا طریقہ',
    'book.serviceFee': 'سروس فیس',
    'book.platformFee': 'پلیٹ فارم فیس',
    'book.totalAmount': 'کل رقم',
    'book.confirmBooking': 'بکنگ کی تصدیق',
    'book.trustGuarantee': 'ہیلپر ٹرسٹ گارنٹی شامل ہے',
    'book.bookingConfirmed': 'بکنگ کی تصدیق ہو گئی!',
    'book.helperDispatched': 'آپ کا ہیلپر بھیجا جا رہا ہے۔',
    'book.liveTrack': 'لائیو ٹریک ہیلپر',
    'book.backHome': 'ہوم پیج پر واپس',
    'book.promoCode': 'پرومو کوڈ',
    'book.applyPromo': 'لاگو کریں',
    'book.discount': 'رعایت',

    // Jobs
    'jobs.title': 'میرے کام',
    'jobs.active': 'فعال',
    'jobs.past': 'گزشتہ',
    'jobs.noActive': 'کوئی فعال کام نہیں۔',
    'jobs.noPast': 'کوئی گزشتہ کام نہیں۔',
    'jobs.cancelRequest': 'درخواست منسوخ کریں',
    'jobs.cancelBooking': 'بکنگ منسوخ کریں',
    'jobs.message': 'پیغام',
    'jobs.leaveReview': 'جائزہ لیں',
    'jobs.submitReview': 'جائزہ جمع کریں',
    'jobs.confirmCancel': 'منسوخی کی تصدیق',
    'jobs.cancelReason': 'منسوخی کی وجہ',

    // Profile
    'profile.editProfile': 'پروفائل میں ترمیم',
    'profile.settings': 'ترتیبات',
    'profile.payments': 'ادائیگی کے طریقے',
    'profile.addresses': 'محفوظ پتے',
    'profile.favorites': 'پسندیدہ',
    'profile.help': 'مدد اور سپورٹ',
    'profile.logout': 'لاگ آؤٹ',

    // Settings
    'settings.title': 'ترتیبات',
    'settings.notifications': 'اطلاعات',
    'settings.password': 'پاس ورڈ اور سیکیورٹی',
    'settings.privacy': 'رازداری کی ترتیبات',
    'settings.language': 'ایپ کی زبان',
    'settings.darkMode': 'ڈارک موڈ',
    'settings.deleteAccount': 'میرا اکاؤنٹ حذف کریں',
    'settings.serviceSettings': 'سروس کی ترتیبات',

    // Cart
    'cart.title': 'میری ٹوکری',
    'cart.empty': 'آپ کی ٹوکری خالی ہے',
    'cart.browseHelpers': 'ہیلپرز براؤز کریں',
    'cart.proceedCheckout': 'چیک آؤٹ پر جائیں',
    'cart.items': 'آئٹمز',
    'cart.addToCart': 'ٹوکری میں شامل کریں',

    // Admin
    'admin.title': 'ہیلپر ایڈمن پورٹل',
    'admin.overview': 'جائزہ',
    'admin.workers': 'ورکرز',
    'admin.users': 'صارفین',
    'admin.jobsOrders': 'کام/آرڈرز',
    'admin.analytics': 'تجزیات',
    'admin.disputes': 'تنازعات',

    // General
    'general.loading': 'لوڈ ہو رہا ہے...',
    'general.error': 'ایک خرابی ہوئی',
    'general.retry': 'دوبارہ کوشش',
    'general.save': 'محفوظ کریں',
    'general.cancel': 'منسوخ',
    'general.confirm': 'تصدیق',
    'general.back': 'واپس',
    'general.next': 'اگلا',
    'general.done': 'ہو گیا',
    'general.perHour': 'فی گھنٹہ',
    'general.rating': 'درجہ بندی',
    'general.kmAway': 'کلومیٹر دور',
  }
};

export type Language = 'en' | 'ur';

export function getTranslation(lang: Language, key: string): string {
  return translations[lang]?.[key] || translations['en']?.[key] || key;
}

export default translations;
