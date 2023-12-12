import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: true,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        resources: {
            en: {
                translation: {
                    header: {
                        home: 'Home',
                        shop: 'Shop',
                        allCategories: 'All Categories',
                        adminCenter: 'Admin Center',
                        hello: 'Hello',
                        register: 'Register',
                        login: 'Log In',
                        editProfile: 'Edit Profile',
                        myOrders: 'My Orders',
                        cart: 'Cart',
                        logout: 'Log Out'

                    },
                    footer: {
                        aboutUs: 'About Us',
                        aboutUsText: 'Explore our curated collection of premium cosmetics, enchanting perfumes, and self-care essentials. Elevate your everyday moments with us.',
                        newsletter: 'Newsletter',
                        enterEmail: 'Enter Your Email',
                        subscribe: 'Subscribe',
                        help: 'Need Help',
                        helpText: 'Got questions or need assistance? Our team is here for you. Reach out for support – we are just a message away!',
                        conactUs: 'Contact Us',
                        address: 'Wartnaby road 123, London, UK',
                        rights: 'All Rights Reserved'
                    },
                    common: {
                        searchByName: 'Search by name',
                        searchByDescription: 'Search by description',
                        backToShop: 'Back to Shop'
                    },
                    shop: {
                        carousel: {
                            welcome: 'Welcome To Our Shop',
                            startShopping: 'Start Shopping ',
                            text1: "Indulge in Beauty: Elevate your skincare routine with our premium cosmetics, discover captivating fragrances, and embrace self-care essentials. Find your signature style at our one-stop beauty destination.",
                            text2: 'Discover Radiance: Unveil the allure of radiant skin, enchanting scents, and self-care treasures. From luxurious cosmetics to alluring perfumes and wellness products, our shop invites you to redefine your beauty ritual.',
                            text3: 'Embrace Your Beauty Journey: Transform your everyday routine into a pampering experience. Explore a curated selection of cosmetics, enticing fragrances, and self-care gems. Your radiant beauty begins here.'
                        },
                        whySection: {
                            why: 'Why Shop With Us',
                            delivery: 'Fast Delivery',
                            shipping: 'Free Shipping',
                            quality: 'Best Quality'
                        },
                        product: {
                            addToCart: "Add to Cart",
                            quickView: 'Quick View',
                            added: 'Added',
                            cart: "Shopping Cart",
                            items: 'Your items',
                            summary: 'Summary',
                            totalPrice: 'Total Price',
                            checkout: 'Checkout',
                            emptyCart: 'Your Cart is empty :(',
                            makeMeHappy: 'Add something to make me happy!',
                            deliveryInfo: 'Delivery Information',
                            receiverName: 'Receiver Name',
                            receiverPhone: 'Receiver Phone Number',
                            additionalComment: 'Additional Comment',
                            novaposhtaCity: 'Nova Poshta City',
                            novaposhtaWarehouse: 'Nova Poshta Warehouse',
                            payment: 'Payment will be done upon receiving',
                            backToCart: 'Back to Cart',
                            makeOrder: 'Make Order',
                            oderHistory: 'Oder History',
                            productName: 'Product Name',
                            quantity: 'Quantity',
                            price: 'Price',
                            comment: 'Comment',
                            receiverInfo: 'Receiver Info',
                            status: 'Status'
                        }

                    },
                    messages: {
                        phoneNotValid: 'Phone number is not valid',
                        nameNotValid: 'Fill out the Receiver Name',
                        selectCity: 'Select city on the righ',
                        selectWarehouse: 'Select warehouse on the right',
                        successOrder: 'Your order has been successfully placed. Expect a clarification call withing 5 minutes',
                        fistNameNotValid: 'Please enter a valid first name.',
                        lastNameNotValid: 'Please enter a valid last name.',
                        userNameNotValid: 'Please enter a valid user name.',
                        passwordsDontMatch: 'New Password and Confirm Password do not match',
                        passwordShort: 'New Password should be at least 6 characters long',
                        incorrectPassword: 'Incorrect Password',
                        resetLinkSent: 'Email with the password reset link has been successfully sent'
                    },
                    auth: {
                        login: 'Log In',
                        update: 'Update Profile',
                        changesSaved: 'Changes Saved',
                        oldPassword: 'Old Password',
                        enterOldPassword: 'Enter Old Password',
                        newPassword: 'New Password',
                        enterNewPassword: 'Enter New Password',
                        goBackToProfile: 'Go Back To Profile',
                        email: 'Email',
                        enterEmail: 'Enter Email',
                        password: 'Password',
                        enterPassword: 'Enter Password',
                        forgotPassword: 'Forgot Password',
                        notMember: 'Not a member',
                        register: 'Register',
                        finishRegistration: 'Finish Registration',
                        close: 'Close',
                        sendEmail: 'Send Email',
                        createNewPassword: 'Create New Password',
                        newPassword: 'New Password',
                        enterNewPassword: 'Enter New Password',
                        confirmPassword: 'Confirm Password',
                        changePassword: 'Change Password',
                        passwordChanged: 'Password successfully changed',
                        createNewAccount: 'Create New Account',
                        firstName: 'First Name',
                        enterFirstName: 'Enter First Name',
                        lastName: 'Last Name',
                        enterLastName: 'Enter Last Name',
                        userName: 'User Name',
                        enterUserName: 'Enter User Name',
                        haveAccount: 'Have an account'
                    }
                },
            },
            uk: {
                translation: {
                    header: {
                        home: 'Головна',
                        shop: 'Магазин',
                        allCategories: 'Усі категорії',
                        adminCenter: 'Центр адміністрування',
                        hello: 'Привіт ',
                        register: 'Реєстрація',
                        login: 'Увійти',
                        editProfile: 'Редагувати профіль',
                        myOrders: 'Мої замовлення',
                        cart: 'Кошик',
                        logout: 'Вийти'
                    },
                    footer: {
                        aboutUs: 'Про нас',
                        aboutUsText: 'Досліджуйте наші відібрані товари преміум-косметики, чарівних парфумів та засобів для самогублагополуччя. Підвищуйте свої повсякденні моменти разом з нами.',
                        newsletter: 'Розсилка',
                        enterEmail: 'Введіть свій email',
                        subscribe: 'Підписатися',
                        help: 'Потрібна допомога',
                        helpText: 'Є питання або потрібна допомога? Наша команда тут для вас. Звертайтеся за підтримкою - ми на зв\'язку!',
                        conactUs: 'Зв\'язатися з нами ',
                        address: 'Вартнейбі роуд 123, Лондон, Велика Британія',
                        rights: 'Всі права захищені'
                    },
                    common: {
                        searchByName: 'Пошук за ім\'ям',
                        searchByDescription: 'Пошук за описом',
                        backToShop: 'Назад до магазину'
                    },
                    shop: {
                        carousel: {
                            welcome: 'Ласкаво просимо до нашого магазину',
                            startShopping: 'Розпочати шопінг ',
                            text1: 'Розкіш у красі: Підвищіть ефективність свого догляду за шкірою за допомогою нашої преміум-косметики, відкрийте захоплюючі аромати та використовуйте засоби для самого себе. Знайдіть свій стиль у нашому унікальному б\'юті - магазині.',
                            text2: 'Відкрийте світло: Розкрийте чарівність сяючої шкіри, захоплюючих ароматів та скарбів для самогублагополуччя. Від розкішної косметики до захоплюючих парфумів та засобів для самопочуття, наш магазин запрошує вас переглянути свою розкіш.',
                            text3: 'Оберіть свій шлях краси: Перетворіть свою щоденну рутину на задоволення. Досліджуйте підібрану колекцію косметики, чарівних ароматів та скарбів для самогублагополуччя. Ваша сяюча краса починається тут.'
                        },
                        whySection: {
                            why: 'Чому купувати у нас',
                            delivery: 'Швидка доставка',
                            shipping: 'Безкоштовна доставка',
                            quality: 'Висока якість'
                        },
                        product: {
                            addToCart: 'Додати до кошика',
                            quickView: 'Швидкий перегляд',
                            added: 'Додано',
                            cart: 'Кошик',
                            items: 'Ваші товари',
                            summary: 'Підсумок',
                            totalPrice: 'Загальна вартість',
                            checkout: 'Оформлення замовлення',
                            emptyCart: 'Ваш кошик порожній :(',
                            makeMeHappy: 'Додайте щось, щоб мене потішити!',
                            deliveryInfo: 'Інформація про доставку',
                            receiverName: 'Ім\'я отримувача',
                            receiverPhone: 'Номер телефону отримувача',
                            additionalComment: 'Додатковий коментар',
                            novaposhtaCity: 'Місто Нової Пошти',
                            novaposhtaWarehouse: 'Відділення Нової Пошти',
                            payment: 'Оплата при отриманні',
                            backToCart: 'Назад до кошика',
                            makeOrder: 'Оформити замовлення',
                            oderHistory: 'Історія замовлень',
                            productName: 'Назва товару',
                            quantity: 'Кількість',
                            price: 'Ціна',
                            comment: 'Коментар',
                            receiverInfo: 'Інформація про отримувача',
                            status: 'Статус'
                        },

                    },
                    messages: {
                        phoneNotValid: 'Номер телефону не є дійсним',
                        nameNotValid: 'Введіть ім\'я отримувача',
                        selectCity: 'Виберіть місто праворуч',
                        selectWarehouse: 'Виберіть відділення праворуч',
                        successOrder: 'Ваше замовлення успішно оформлено. Очікуйте дзвінка для уточнення протягом 5 хвилин',
                        fistNameNotValid: 'Будь ласка, введіть дійсне ім\'я',
                        lastNameNotValid: 'Будь ласка, введіть дійсне прізвище',
                        userNameNotValid: 'Будь ласка, введіть дійсне ім\'я користувача',
                        passwordsDontMatch: 'Новий пароль і підтвердження пароля не збігаються',
                        passwordShort: 'Новий пароль повинен містити принаймні 6 символів',
                        incorrectPassword: 'Неправильний пароль',
                        resetLinkSent: 'Email із посиланням на скидання пароля успішно відправлено'
                    },
                    auth: {
                        login: 'Увійти',
                        update: 'Оновити профіль',
                        changesSaved: 'Зміни збережено',
                        oldPassword: 'Старий пароль',
                        enterOldPassword: 'Введіть старий пароль',
                        newPassword: 'Новий пароль',
                        enterNewPassword: 'Введіть новий пароль',
                        passwordChanged: 'Пароль успішно змінено',
                        goBackToProfile: 'Повернутися',
                        email: 'Email',
                        enterEmail: 'Введіть Email',
                        password: 'Пароль',
                        enterPassword: 'Введіть пароль',
                        forgotPassword: 'Забули пароль',
                        notMember: 'Не маєте облікового запису',
                        register: 'Реєстрація',
                        finishRegistration: 'Завершити Реєстрацію',
                        close: 'Закрити',
                        sendEmail: 'Відправити Email',
                        createNewPassword: 'Створити новий пароль',
                        confirmPassword: 'Підтвердити пароль',
                        changePassword: 'Змінити пароль',
                        createNewAccount: 'Створити новий обліковий запис',
                        firstName: 'Ім\'я',
                        enterFirstName: 'Введіть ім\'я',
                        lastName: 'Прізвище',
                        enterLastName: 'Введіть прізвище',
                        userName: 'Ім\'я користувача',
                        enterUserName: 'Введіть ім\'я користувача',
                        haveAccount: 'Вже маєте обліковий запис'
                    }
                },
            },
        }
    });

export default i18n;