import React, { createContext, useState, useContext, useEffect } from 'react';

const translations = {
    en: {
        // Navbar
        dashboard: 'Dashboard Overview',
        admin_user: 'Admin User',
        

        // Sidebar
        sidebar_dashboard: 'Dashboard',
        sidebar_products: 'Products',
        sidebar_categories: 'Categories',
        sidebar_orders: 'Orders',
        sidebar_customers: 'Customers',
        sidebar_upload: 'Upload Clothes',
        sidebar_users: 'User Management',
        sidebar_settings: 'Settings',
        logout: 'Logout',

        // Dashboard Page
        welcome: 'Welcome back, Admin!',
        store_today: "Here's what's happening with your store today.",
        total_products: 'Total Products',
        total_orders: 'Total Orders',
        total_customers: 'Total Customers',
        revenue: 'Revenue',
        from_last_month: 'from last month',
        recent_products: 'Recent Products',
        no_products: 'No products found.',
        stock: 'Stock',
        failed_to_load_products: 'Failed to load recent products',

        // Products Page
        products_management: 'Products Management',
        manage_inventory: 'Manage your clothing inventory',
        add_new_product: 'Add New Product',
        search_products: 'Search products...',
        all_categories: 'All Categories',
        all_genders: 'All Genders',
        sort_by_name: 'Sort by: Name (A to Z)',
        sort_by_newest: 'Sort by: Newest Arrived',
        sort_by_updated: 'Sort by: Recently Updated',
        category: 'Category',
        gender: 'Gender',
        product: 'Product',
        price: 'Price',
        stock: 'Stock',
        status: 'Status',
        actions: 'Actions',
        edit: 'Edit',
        delete: 'Delete',
        in_stock: 'In Stock',
        out_of_stock: 'Out of Stock',
        previous: 'Previous',
        next: 'Next',
        page_of: 'Page {page} of {totalPages}',
        confirm_delete_product: 'Are you sure you want to delete this product?',
        product_deleted_success: 'Product deleted successfully',
        failed_delete_product: 'Failed to delete product',
        failed_load_products: 'Failed to load products',

        // Upload Form
        upload_clothes: 'Upload New Clothes',
        edit_product: 'Edit Product',
        basic_information: 'Basic Information',
        edit_product_description: 'Update product information',
        upload_clothes_description: 'Add a new product to your clothing store',
        product_name: 'Product Name',
        description: 'Description',
        brand: 'Brand',
        size: 'Size',
        color: 'Color',
        pricing_inventory: 'Pricing & Inventory',
        discount_price: 'Discount Price',
        stock_quantity: 'Stock Quantity',
        status_label: 'Status',
        created_at: 'Created At',
        updated_at: 'Updated At',
        featured_product: 'Featured Product',
        product_images: 'Product Images',
        add_image_url: 'Add Image URL',
        cancel: 'Cancel',
        save: 'Save',
        update: 'Update',
        select: 'Select',
        required: 'Required',
        enter_url_first: 'Please enter a URL first',
        url_exists: 'This URL already exists',
        add: 'Add',
        image_instructions: 'Enter image URL and click Add. Supports JPG, PNG, GIF, etc.',
        no_images_message: 'No images added. Please add at least one image URL.',

        // User Management
        user_management: 'User Management',
        monitor_registrations: 'Monitor registrations, review records, and configure status parameters.',
        pending: 'Pending',
        approved: 'Approved',
        rejected: 'Rejected',
        user_id: 'User ID',
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        role: 'Role',
        joined: 'Joined',
        last_updated: 'Last Updated',
        full_identity: 'Full Identity',
        accept: 'Accept',
        reject: 'Reject',
        close: 'Close',
        delete_user: 'Delete User',

        orders: 'Orders',
        monitor_orders: 'Monitor registrations, review records, and configure status parameters.',
        orders_pending: 'Pending',
        orders_approved: 'Approved',
        orders_completed: 'Completed',
        orders_rejected: 'Rejected',
        newest_activity: 'Newest Activity',
        oldest_activity: 'Oldest Activity',
        order_id: 'Order ID',
        customer: 'Customer',
        email: 'Email',
        phone: 'Phone',
        total_amount: 'Total Amount',
        actions: 'Actions',
        no_records: 'No records found.',
        delete_order: 'Delete Order',
        inspect_order: 'Inspect Order',
        confirm_delete_order: 'Permanently delete order #{orderId} for {customerName}? This action cannot be undone.',
        yes_delete: 'Yes, Delete',
        order_cancelled: 'Order has been cancelled.',
        order_approved: 'Order has been approved.',
        update_failed: 'Failed to update order status.',
        failed_to_load: 'Failed to load orders.',
        order_details: 'Order Details',
        customer_info: 'Customer Info',
        name: 'Name',
        items_placed: 'Items Placed',
        no_items: 'No products in this order.',
        unknown_product: 'Unknown Product',
        variant: 'Variant',
        adjustment_note: 'Adjustment Note / Apology Message',
        select_reason: '-- Select a reason (optional) --',
        stock_issue: 'Stock issue – cannot fulfill',
        cancelled_as_requested: 'Cancelled as requested',
        quantity_adjustment: 'Quantity adjustment needed',
        approved_process: 'Approved – will process soon',
        cannot_fulfill: 'Cannot fulfill at this time',
        total_value: 'Total Value',
        cancel_order: 'Cancel Order',
        approve_order: 'Approve Order',
        close_panel: 'Close Panel',
        confirm_cancel_order: 'Are you sure you want to CANCEL this order?',
        confirm_approve_order: 'Are you sure you want to APPROVE this order?',
        yes_cancel: 'Yes, Cancel',
        yes_approve: 'Yes, Approve',
        order_deleted: 'Order {orderId} deleted from local view.',

        // Buttons / Actions
        yes_delete: 'Yes, Delete',
        yes_approve: 'Yes, Approve',
        yes_cancel: 'Yes, Cancel',
        yes_reject: 'Yes, Reject',
        confirm: 'Confirm',
        cancel_action: 'Cancel',

        // Login Page
        login_title: 'Welcome Back',
        login_subtitle: 'Sign in to access your admin control panel',
        email_label: 'Admin Email',
        password_label: 'Password',
        sign_in: 'Sign In',
        forgot_password: 'Forgot password?',
        authenticating: 'Authenticating...',
        all_fields_required: 'All fields are required',
        hide: 'Hide',
        show: 'Show',

        // Alerts / Messages
        success: 'Success',
        error: 'Error',

        // Placeholders
        enter_product_name: 'Enter product name',
        enter_description: 'Product description',
        enter_brand: 'Brand name',
        enter_price: '0.00',
        enter_discount: '0.00',
        enter_stock: '0',
        enter_image_url: 'https://example.com/image.jpg',

        // ADDED MISSING KEYS BELOW
        confirm_delete_order: 'Permanently delete order #{orderId} for {customerName}? This action cannot be undone.',
        order_deleted: 'Order {orderId} deleted from local view.',
        confirm_cancel_order: 'Are you sure you want to CANCEL this order?',
        confirm_approve_order: 'Are you sure you want to APPROVE this order?',
        order_cancelled: 'Order cancelled successfully',
        order_approved: 'Order approved successfully',
        update_failed: 'Failed to update order status',
        failed_to_load: 'Failed to load orders',
        no_items: 'No products in this order.',
        unknown_product: 'Unknown Product',

        //setting
        settings_title: "System Dashboard Settings",
        settings_subtitle: "Configure your global retail shop parameters and identity records.",
        store_name: "Store Name",
        enter_store_name: "Enter store name",
        store_phone: "Store Phone",
        enter_store_phone: "Enter store phone number",
        admin_name: "Admin Name",
        enter_admin_name: "Enter admin name",
        admin_email: "Admin Email",
        enter_admin_email: "Enter admin email",
        currency: "Currency",
        low_stock_threshold: "Low Stock Threshold",
        enter_low_stock: "Enter low stock threshold",
        store_address: "Store Address",
        enter_store_address: "Enter store address",
        cancel: "Cancel",
        save: "Save",
        changes_discarded: "Changes discarded",
        settings_saved: "Dashboard settings saved successfully!"
    },
    my: {
        // Navbar
        dashboard: 'ဒက်ရှ်ဘုတ် ခြုံငုံသုံးသပ်ချက်',
        admin_user: 'အက်ဒမင် အသုံးပြုသူ',

        // Sidebar
        sidebar_dashboard: 'ဒက်ရှ်ဘုတ်',
        sidebar_products: 'ထုတ်ကုန်များ',
        sidebar_categories: 'အမျိုးအစားများ',
        sidebar_orders: 'အော်ဒါများ',
        sidebar_customers: 'ဖောက်သည်များ',
        sidebar_upload: 'အဝတ်တင်ရန်',
        sidebar_users: 'အသုံးပြုသူများ',
        sidebar_settings: 'ဆက်တင်များ',
        logout: 'အကောင့်မှထွက်မည်',

        // Dashboard Page
        welcome: 'ပြန်လည်ကြိုဆိုပါတယ် အက်ဒမင်!',
        store_today: 'ယနေ့ သင့်စတိုးဆိုင်တွင် ဖြစ်ပျက်နေသည်များ။',
        total_products: 'စုစုပေါင်း ထုတ်ကုန်',
        total_orders: 'စုစုပေါင်း အော်ဒါ',
        total_customers: 'စုစုပေါင်း ဖောက်သည်',
        revenue: 'ဝင်ငွေ',
        from_last_month: 'လွန်ခဲ့သောလမှ',
        recent_products: 'မကြာသေးမီက ထုတ်ကုန်များ',
        no_products: 'ထုတ်ကုန်မရှိပါ။',
        stock: 'အရေအတွက်',
        failed_to_load_products: 'မကြာသေးမီက ထုတ်ကုန်များ ရယူရန် ပျက်ကွက်ခဲ့သည်',

        // Products Page
        products_management: 'ထုတ်ကုန် စီမံခန့်ခွဲမှု',
        manage_inventory: 'သင့်အဝတ်အထည်စာရင်းကို စီမံပါ',
        add_new_product: 'ထုတ်ကုန်အသစ်ထည့်ရန်',
        search_products: 'ထုတ်ကုန်ရှာဖွေရန်...',
        all_categories: 'အမျိုးအစားအားလုံး',
        all_genders: 'လိင်အားလုံး',
        sort_by_name: '	စီရန်: အမည် (A မှ Z)',
        sort_by_newest: 'စီရန်: အသစ်ဆုံးရောက်ရှိမှု',
        sort_by_updated: 'စီရန်: မကြာသေးမီက ပြင်ဆင်မှု',
        category: 'အမျိုးအစား',
        gender: 'လိင်',
        product: 'ထုတ်ကုန်',
        price: 'စျေးနှုန်း',
        stock: 'အရေအတွက်',
        status: 'အခြေအနေ',
        actions: 'လုပ်ဆောင်ချက်များ',
        edit: 'ပြင်ဆင်ရန်',
        delete: 'ဖျက်ရန်',
        in_stock: 'အဆင်သင့်ရှိ',
        out_of_stock: 'ကုန်သွားပါပြီ',
        previous: 'နောက်သို့',
        next: 'ရှေ့သို့',
        page_of: 'စာမျက်နှာ {page} / {totalPages}',
        confirm_delete_product: 'ဤထုတ်ကုန်ကို ဖျက်မည်မှာ သေချာပါသလား?',
        product_deleted_success: 'ထုတ်ကုန် အောင်မြင်စွာ ဖျက်ပြီးပါပြီ',
        failed_delete_product: 'ထုတ်ကုန်ဖျက်ရန် မအောင်မြင်ပါ',
        failed_load_products: 'ထုတ်ကုန်များ ရယူရန် မအောင်မြင်ပါ',

        // Upload Form
        upload_clothes: 'အဝတ်အသစ်တင်ရန်',
        edit_product: 'ထုတ်ကုန်ပြင်ဆင်ရန်',
        basic_information: 'အခြေခံအချက်အလက်',
        upload_clothes_description: 'သင့်အဝတ်အထည်ဆိုင်သို့ ထုတ်ကုန်အသစ်ထည့်ရန်',
        edit_product_description: 'ထုတ်ကုန်အချက်အလက်ကို ပြင်ဆင်ပါ',
        product_name: 'ထုတ်ကုန်အမည်',
        description: 'ဖော်ပြချက်',
        brand: 'အမှတ်တံဆိပ်',
        size: 'အရွယ်အစား',
        color: 'အရောင်',
        pricing_inventory: 'စျေးနှုန်းနှင့် စာရင်း',
        discount_price: 'လျှော့စျေး',
        stock_quantity: 'စာရင်းအရေအတွက်',
        status_label: 'အခြေအနေ',
        created_at: 'ဖန်တီးသည့်ရက်',
        updated_at: 'နောက်ဆုံးပြင်သည့်ရက်',
        featured_product: 'အထူးထုတ်ကုန်',
        product_images: 'ထုတ်ကုန်ပုံများ',
        add_image_url: 'ပုံ URL ထည့်ရန်',
        cancel: 'မလုပ်တော့',
        save: 'သိမ်းရန်',
        update: 'ပြင်ဆင်ရန်',
        select: 'ရွေးပါ',
        required: 'လိုအပ်သည်',
        enter_url_first: 'URL တစ်ခုကို ဦးစွာထည့်ပါ',
        url_exists: 'ဤ URL ရှိပြီးသားဖြစ်သည်',
        add: 'ထည့်ရန်',
        image_instructions: 'ပုံ URL ထည့်ပြီး Add ကိုနှိပ်ပါ။ JPG, PNG, GIF စသည်တို့ကို ထောက်ပံ့သည်။',
        no_images_message: 'ပုံများ မထည့်ရသေးပါ။ ပုံ URL အနည်းဆုံးတစ်ခု ထည့်ပါ။',

        // User Management
        user_management: 'အသုံးပြုသူ စီမံခန့်ခွဲမှု',
        monitor_registrations: 'မှတ်ပုံတင်မှုများကို စောင့်ကြည့်၊ မှတ်တမ်းများကို ပြန်လည်သုံးသပ်၊ အခြေအနေများကို သတ်မှတ်ပါ။',
        pending: 'ဆိုင်းငံ့ထားသည်',
        approved: 'အတည်ပြုပြီး',
        rejected: 'ငြင်းပယ်ထားသည်',
        user_id: 'အသုံးပြုသူ ID',
        name: 'အမည်',
        email: 'အီးမေး',
        phone: 'ဖုန်းနံပါတ်',
        role: 'အခန်းကဏ္ဍ',
        joined: 'စာရင်းသွင်းသည့်နေ့',
        last_updated: 'နောက်ဆုံးပြင်ဆင်သည့်နေ့',
        full_identity: 'အထောက်အထား အပြည့်အစုံ',
        accept: 'အတည်ပြုသည်',
        reject: 'ငြင်းပယ်သည်',
        close: 'ပိတ်ရန်',
        delete_user: 'အသုံးပြုသူ ဖျက်ရန်',

        //order page
        orders: 'အော်ဒါများ',
        monitor_orders: 'မှတ်ပုံတင်မှုများကို စောင့်ကြည့်၊ မှတ်တမ်းများကို ပြန်လည်သုံးသပ်၊ အခြေအနေများကို သတ်မှတ်ပါ။',
        orders_pending: 'ဆိုင်းငံ့ထားသည်',
        orders_approved: 'အတည်ပြုပြီး',
        orders_completed: 'ပြီးဆုံးသည်',
        orders_rejected: 'ငြင်းပယ်ထားသည်',
        newest_activity: 'နောက်ဆုံးလုပ်ဆောင်မှု',
        oldest_activity: 'အဟောင်းဆုံးလုပ်ဆောင်မှု',
        order_id: 'အော်ဒါ ID',
        customer: 'ဖောက်သည်',
        email: 'အီးမေး',
        phone: 'ဖုန်းနံပါတ်',
        total_amount: 'စုစုပေါင်းငွေ',
        actions: 'လုပ်ဆောင်ချက်များ',
        no_records: 'မှတ်တမ်းမရှိပါ။',
        delete_order: 'အော်ဒါဖျက်ရန်',
        inspect_order: 'အော်ဒါကြည့်ရန်',
        confirm_delete_order: 'အော်ဒါ #{orderId} ကို {customerName} အတွက် အပြီးအပိုင် ဖျက်မလား? ဤလုပ်ဆောင်ချက်ကို နောက်ပြန်မလှည့်နိုင်ပါ။',
        yes_delete: 'ဟုတ်ကဲ့၊ ဖျက်မည်',
        order_cancelled: 'အော်ဒါကို ဖျက်သိမ်းလိုက်ပါပြီ။',
        order_approved: 'အော်ဒါကို အတည်ပြုလိုက်ပါပြီ။',
        update_failed: 'အော်ဒါအခြေအနေ အပ်ဒိတ်မအောင်မြင်ပါ။',
        failed_to_load: 'အော်ဒါများ ရယူရန် မအောင်မြင်ပါ။',
        order_details: 'အော်ဒါအသေးစိတ်',
        customer_info: 'ဖောက်သည်အချက်အလက်',
        name: 'အမည်',
        items_placed: 'မှာထားသောပစ္စည်းများ',
        no_items: 'ဤအော်ဒါတွင် ပစ္စည်းမရှိပါ။',
        unknown_product: 'အမည်မသိထုတ်ကုန်',
        variant: 'မျိုးကွဲ',
        adjustment_note: 'ပြုပြင်မှုမှတ်ချက် / တောင်းပန်စာ',
        select_reason: '-- အကြောင်းပြချက်တစ်ခုရွေးပါ (ရွေးချယ်နိုင်သည်) --',
        stock_issue: 'စာရင်းပြဿနာ – မဖြည့်ဆည်းနိုင်ပါ',
        cancelled_as_requested: 'တောင်းဆိုချက်အရ ဖျက်သိမ်းထားသည်',
        quantity_adjustment: 'အရေအတွက် ပြုပြင်ရန် လိုအပ်သည်',
        approved_process: 'အတည်ပြုပြီး – မကြာမီ ဆောင်ရွက်မည်',
        cannot_fulfill: 'ကံမကောင်းစွာဖြင့် ယခုအချိန်တွင် မဖြည့်ဆည်းနိုင်ပါ',
        total_value: 'စုစုပေါင်းတန်ဖိုး',
        cancel_order: 'အော်ဒါဖျက်သိမ်းရန်',
        approve_order: 'အော်ဒါအတည်ပြုရန်',
        close_panel: 'အကန့်ပိတ်ရန်',
        confirm_cancel_order: 'ဤအော်ဒါကို ဖျက်သိမ်းရန် သေချာပါသလား?',
        confirm_approve_order: 'ဤအော်ဒါကို အတည်ပြုရန် သေချာပါသလား?',
        yes_cancel: 'ဟုတ်ကဲ့၊ ဖျက်သိမ်းမည်',
        yes_approve: 'ဟုတ်ကဲ့၊ အတည်ပြုမည်',
        order_deleted: 'အော်ဒါ {orderId} ကို စာရင်းမှ ဖျက်လိုက်ပါပြီ။',

        // Buttons / Actions
        yes_delete: 'ဟုတ်ကဲ့၊ ဖျက်မည်',
        yes_approve: 'ဟုတ်ကဲ့၊ အတည်ပြုမည်',
        yes_cancel: 'ဟုတ်ကဲ့၊ ဖျက်သိမ်းမည်',
        yes_reject: 'ဟုတ်ကဲ့၊ ငြင်းပယ်မည်',
        confirm: 'အတည်ပြုသည်',
        cancel_action: 'မလုပ်တော့',

        // Login Page
        login_title: 'ပြန်လည်ကြိုဆိုပါတယ်',
        login_subtitle: 'သင့်အက်ဒမင် ထိန်းချုပ်မှု panel ကို ဝင်ရောက်ရန် လက်မှတ်ထိုးပါ',
        email_label: 'အက်ဒမင် အီးမေး',
        password_label: 'စကားဝှက်',
        sign_in: 'ဝင်ရန်',
        forgot_password: 'စကားဝှက်မေ့နေပါသလား?',
        authenticating: 'အတည်ပြုနေသည်...',
        all_fields_required: 'အားလုံးဖြည့်ရန် လိုအပ်သည်',
        hide: 'ဝှက်ရန်',
        show: 'ပြရန်',

        // Alerts / Messages
        success: 'အောင်မြင်သည်',
        error: 'အမှားရှိသည်',

        // Placeholders
        enter_product_name: 'ထုတ်ကုန်အမည် ထည့်ပါ',
        enter_description: 'ထုတ်ကုန်ဖော်ပြချက်',
        enter_brand: 'အမှတ်တံဆိပ်အမည်',
        enter_price: '၀.၀၀',
        enter_discount: '၀.၀၀',
        enter_stock: '၀',
        enter_image_url: 'https://example.com/image.jpg',

        // ADDED MISSING KEYS BELOW
        confirm_delete_order: 'အော်ဒါ #{orderId} ကို {customerName} အတွက် အပြီးအပိုင် ဖျက်မည်လား? ဤလုပ်ဆောင်ချက်ကို ပြန်၍မလုပ်နိုင်ပါ။',
        order_deleted: 'အော်ဒါ {orderId} ကို ဖယ်ရှားလိုက်ပါပြီ။',
        confirm_cancel_order: 'ဤအော်ဒါကို ဖျက်သိမ်းရန် သေချာပါသလား?',
        confirm_approve_order: 'ဤအော်ဒါကို အတည်ပြုရန် သေချာပါသလား?',
        order_cancelled: 'အော်ဒါကို ဖျက်သိမ်းလိုက်ပါပြီ',
        order_approved: 'အော်ဒါကို အတည်ပြုလိုက်ပါပြီ',
        update_failed: 'အော်ဒါအခြေအနေ ပြောင်းလဲရန် မအောင်မြင်ပါ',
        failed_to_load: 'အော်ဒါများ ရယူရန် မအောင်မြင်ပါ',
        no_items: 'ဤအော်ဒါတွင် ပစ္စည်းမရှိပါ။',
        unknown_product: 'မသိသော ထုတ်ကုန်',

        //setting
        settings_title: "စနစ် ဒက်ရှ်ဘုတ် ဆက်တင်များ",
        settings_subtitle: "သင့်လက်လီဆိုင် ကန့်သတ်ချက်များနှင့် မှတ်တမ်းများကို သတ်မှတ်ပါ။",
        store_name: "ဆိုင်အမည်",
        enter_store_name: "ဆိုင်အမည် ထည့်ပါ",
        store_phone: "ဆိုင်ဖုန်းနံပါတ်",
        enter_store_phone: "ဆိုင်ဖုန်းနံပါတ် ထည့်ပါ",
        admin_name: "အက်ဒမင် အမည်",
        enter_admin_name: "အက်ဒမင် အမည် ထည့်ပါ",
        admin_email: "အက်ဒမင် အီးမေး",
        enter_admin_email: "အက်ဒမင် အီးမေး ထည့်ပါ",
        currency: "ငွေကြေး",
        low_stock_threshold: "စာရင်းနည်းပါးသည့် ကန့်သတ်ချက်",
        enter_low_stock: "စာရင်းနည်းပါးသည့် ကန့်သတ်ချက် ထည့်ပါ",
        store_address: "ဆိုင်လိပ်စာ",
        enter_store_address: "ဆိုင်လိပ်စာ ထည့်ပါ",
        cancel: "မလုပ်တော့",
        save: "သိမ်းရန်",
        changes_discarded : "ပြောင်းလဲမှုများ ပယ်ဖျက်ပြီး",
        settings_saved : "ဒက်ရှ်ဘုတ် ဆက်တင်များကို အောင်မြင်စွာ သိမ်းပြီးပါပြီ။"
    }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    // ✅ Default language ကို 'my' (မြန်မာ) အဖြစ်သတ်မှတ်ပါ
    const [lang, setLang] = useState(() => {
        const saved = localStorage.getItem('lang');
        return saved === 'en' ? 'en' : 'my';  // default to Myanmar
    });

    useEffect(() => {
        localStorage.setItem('lang', lang);
        document.documentElement.lang = lang;
    }, [lang]);

    const toggleLang = () => {
        setLang(prev => (prev === 'en' ? 'my' : 'en'));
    };

    // ✅ ဤနေရာတွင် ပြင်ဆင်ရန် (params ထည့်သွင်းရန်)
    const t = (key, params = null) => {
        let text = translations[lang]?.[key] || key;
        if (params) {
            Object.keys(params).forEach(k => {
                text = text.replace(`{${k}}`, params[k]);
            });
        }
        return text;
    };


    return (
        <LanguageContext.Provider value={{ lang, toggleLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within LanguageProvider');
    return context;
}