import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';

const site = 'https://vue3-course-api.hexschool.io/v2';
const api_path = 'clara-vue3';

let productModal = {};
let deleteModal = {};

const app = createApp({
  data() {
    return {
      products: [],
      detail: {
        imagesUrl: [],
      },
      newProduct: true
    }
  },
  methods: {
    checkLogin() {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)claraToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      axios.defaults.headers.common['Authorization'] = token;
      const url = `${site}/api/user/check`;
      axios.post(url)
        .then(() => {
          this.getProducts();
        })
        .catch(err => {
          alert(err.data.message);
          window.location = './index.html';
        })
    },
    getProducts() {
      const url = `${site}/api/${api_path}/admin/products/all`;
      axios.get(url)
        .then(res => {
          this.products = Object.values(res.data.products);
        })
        .catch(err => {
          alert(err.data.message);
        })
    },
    openModal(status, product) {
      if (status === 'newProduct') {
        this.detail = {
          imagesUrl: []
        };
        productModal.show();
        this.newProduct = true;
      } else if (status === 'editProduct') {
        this.detail = { ...product };
        productModal.show();
        this.newProduct = false;
      } else if (status === 'deleteProduct') {
        this.detail = { ...product };
        deleteModal.show();
      }
    },
    updateProduct() {
      let url = `${site}/api/${api_path}/admin/product`;
      let method = 'post';

      if (!this.newProduct) {
        url = `${site}/api/${api_path}/admin/product/${this.detail.id}`;
        method = 'put';
      }

      axios[method](url, { data: this.detail })
        .then(res => {
          alert(res.data.message);
          this.getProducts();
          productModal.hide();
        })
        .catch(err => {
          alert(err.data.message);
        });
    },
    deleteProduct() {
      const url = `${site}/api/${api_path}/admin/product/${this.detail.id}`;

      axios.delete(url)
        .then(res => {
          alert(res.data.message);
          this.getProducts();
          deleteModal.hide();
        })
        .catch(err => {
          alert(err.data.message);
        });
    },
    addImages() {
      this.detail.imagesUrl = [];
      this.detail.imagesUrl.push('');
    }
  },
  mounted() {
    this.checkLogin();
    productModal = new bootstrap.Modal(document.getElementById('productModal'));
    deleteModal = new bootstrap.Modal(document.getElementById('deleteProductModal'));
  }
});

app.mount('#app');