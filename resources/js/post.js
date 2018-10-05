require('./bootstrap.js');

import Post from './components/Post.vue';

// Vue.component('List', require('./components/List.vue'));
new Vue({
    el: '#app',
    components: { Post }
})