import pagination from './pagination.js';
import modal from './modal.js';

Vue.component('pagination', pagination);
Vue.component('modal', modal);

new Vue({
  el: '#app',
  data: {
    products: [],
    pagination: {},
    tempProduct: {
      imageUrl: []
    },
    api: {
      uuid: '20f81077-1b58-4538-baa0-999ec629e11b',
      path: 'https://course-ec-api.hexschool.io/api/',
    },
    token: '',
    isNew: false,
    loadingBtn: '',
  },
  methods: {
    updateProduct() { },
    openModal(isNew, item) {
      switch (isNew) {
        case 'new':
          this.tempProduct = { imageUrl: [] };
          this.isNew = true;
          $('#productModal').modal('show');
          break;
        case 'edit':
          this.isNew = false;
          this.loadingBtn = item.id;
          const url = `${this.api.path}${this.api.uuid}/admin/ec/product/${item.id}`;
          axios.get(url).then((res) => {
            this.tempProduct = res.data.data;
            $('#productModal').modal('show');
            this.loadingBtn = '';
          });
          break;
        case 'delete':
          $('#delProductModal').modal('show');
          this.tempProduct = JSON.parse(JSON.stringify(item));
          break;
        default:
          break;
      }
    },
    delProduct() {
      if (this.tempProduct.id) {
        const id = this.tempProduct.id;
        this.products.forEach((item, i) => {
          if (item.id === id) {
            this.products.splice(i, 1);
            this.tempProduct = {};
          }
        });
      }
      $('#delProductModal').modal('hide');
    },
    getProducts(num = 1) {
      const url = `${this.api.path}${this.api.uuid}/admin/ec/products?page=${num}`;
      axios.get(url).then((res) => {
        this.products = res.data.data;
        this.pagination = res.data.meta.pagination;

        if (this.tempProduct.id) {
          this.tempProduct = {
            imageUrl: [],
          };
          $('#productModal').modal('hide');
        }
      });
    },
  },
  created() {
    this.token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
    axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    this.getProducts();
  },
});
