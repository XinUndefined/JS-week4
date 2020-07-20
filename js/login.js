const uuid = '20f81077-1b58-4538-baa0-999ec629e11b';
const apiPath = 'https://course-ec-api.hexschool.io/api/';
Vue.component('loading', VueLoading);
new Vue({
    el: '#app',
    data: {
        isLoading: false,
        user: {
            email: '',
            password: '',
        },
        token: ''
    },
    methods: {
        signin() {
            this.isLoading = true;
            const api = `${apiPath}auth/login`;
            axios.post(api, this.user).then((response) => {
                const token = response.data.token;
                const expired = response.data.expired;
                document.cookie = `hexToken=${token}; expires=${new Date(expired * 1000)}; path=/`;
                window.location = 'product.html';

            }).catch(err => {
                setTimeout("window.location.reload()", 1500);
                if (err.response.status === 422) {
                    Swal.fire({
                        toast: true,
                        text: '帳號、密碼不符',
                        icon: 'error',
                        showConfirmButton: false,
                        timer: 1500,
                        padding: '2em',
                    });
                }
            })
        },
    },
})