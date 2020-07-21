Vue.component('loading', VueLoading);
new Vue({
    el: '#app',
    data: {
        isLoading: false,
        user: {
            email: '',
            password: '',
        },
    },
    methods: {
        signin() {
            this.isLoading = true;
            const api = `https://course-ec-api.hexschool.io/api/auth/login`;
            axios.post(api, this.user).then((response) => {
                const token = response.data.token;
                const expired = response.data.expired;
                // 寫入 cookie token
                // expires 設置有效時間
                document.cookie = `token=${token};expires=${new Date(expired * 1000)}; path=/`;
                window.location = 'Products.html';
            }).catch((error) => {
                console.log(error);
            });
        },
    },
})