Vue.component('delProductModal', {
    template: '#delProductModal',
    data() {
        return {
        };
    },
    props: {
        tempProduct: {
            type: Object,
            default() {
                return {
                    imageUrl: [],
                };
            },
        },
        user: {
            type: Object,
            default() {
                return {
                };
            },
        },
    },
    methods: {
        // 刪除產品
        delProduct() {
            const url = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product/${this.tempProduct.id}`;

            //預設帶入 token
            axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`;

            axios.delete(url).then(() => {
                $('#delProductModal').modal('hide');
                this.$emit('update');
            });
        },
    }
});

Vue.component('productModal', {
    template: '#productModal',
    data() {
        return {
            tempProduct: {
                imageUrl: [],
            },
        };
    },
    props: {
        productid: {
            type: String,
            default: '',
        },
        status: {
            type: Object,
            default() {
                return {
                };
            },
        },
        isNew: {
            type: Boolean,
            default: true,
        },
        user: {
            type: Object,
            default() {
                return {
                };
            },
        },
    },
    methods: {
        getProduct(id) {
            const api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product/${id}`;
            axios.get(api).then((res) => {
                $('#productModal').modal('show');
                this.tempProduct = res.data.data;
            }).catch((error) => {
                console.log(error);
            });
        },
        // 上傳產品資料
        updateProduct() {
            // 新增商品
            let api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product`;
            let httpMethod = 'post';
            // 當不是新增商品時則切換成編輯商品 API
            if (!this.isNew) {
                api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product/${this.tempProduct.id}`;
                httpMethod = 'patch';
            }

            //預設帶入 token
            axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`;

            axios[httpMethod](api, this.tempProduct).then(() => {
                $('#productModal').modal('hide');
                this.$emit('update');
            }).catch((error) => {
                console.log(error)
            });
        },
        // 上傳檔案
        uploadFile() {
            const uploadedFile = this.$refs.file.files[0];
            const formData = new FormData();
            formData.append('file', uploadedFile);
            const url = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/storage`;
            this.status.fileUploading = true;
            axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((response) => {
                this.status.fileUploading = false;
                if (response.status === 200) {
                    this.tempProduct.imageUrl.push(response.data.data.path);
                }
            }).catch(() => {
                console.log('上傳不可超過 2 MB');
                this.status.fileUploading = false;
            });
        },
    },
});

Vue.component('pagination', {
    template: '#pagination',
    data() {
        return {
        };
    },
    props: {
        pages: {
            type: Object,
            default() {
                return {
                };
            },
        },
    },
    methods: {
        emitPages(item) {
            this.$emit('emit-pages', item);
        },
    },
});

new Vue({
    el: '#app',
    data() {
        return {
            products: [],
            pagination: {},
            tempProduct: {
                imageUrl: [],
            },
            isNew: false,
            status: {
                fileUploading: false,
            },
            user: {
                token: '',
                uuid: '20f81077-1b58-4538-baa0-999ec629e11b',
            },
        };
    },
    created() {
        // 取得 token 的 cookies
        // 詳情請見：https://developer.mozilla.org/zh-CN/docs/Web/API/Document/cookie
        this.user.token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        // 若無法取得 token 則返回 Login 頁面
        if (this.user.token === '') {
            window.location = 'index.html';
        }

        this.getProducts();
    },
    methods: {
        // 取得產品資料
        getProducts(page = 1) {
            const api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/products?page=${page}`;
            //預設帶入 token
            axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`;

            axios.get(api).then((response) => {
                this.products = response.data.data;
                this.pagination = response.data.meta.pagination;
            });
        },
        // 開啟 Modal 視窗
        openModal(isNew, item) {
            switch (isNew) {
                case 'new':
                    this.tempProduct = {
                        imageUrl: [],
                    };
                    this.isNew = true;
                    $('#productModal').modal('show');
                    break;
                case 'edit':
                    this.tempProduct = Object.assign({}, item);
                    // 使用 refs 觸發子元件方法
                    this.$refs.productModel.getProduct(this.tempProduct.id);
                    this.isNew = false;
                    break;
                case 'delete':
                    this.tempProduct = Object.assign({}, item);
                    $('#delProductModal').modal('show');
                    break;
                default:
                    break;
            }
        },
    },
})