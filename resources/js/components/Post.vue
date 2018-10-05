<template>
    <div class="content">
        <List id="list">
            <div v-for="post in posts" :key="post.id" class="fade-item">
                <h1>{{ post.title }}</h1>
                <p>{{ post.body }}</p>
                <button class="btn btn-xs btn-primary" @click="modify(post)">修改</button>
                <button class="btn btn-xs btn-danger" @click="remove(post.id)">刪除</button>
                <hr>
            </div>
        </List>
        <form id="form">
            <div class="form-group" :class="{ 'has-warning': titleWarning }">
                <label class="control-label">標題
                    <span v-if="titleWarning">不能空白</span>
                </label>
                <input class="form-control" v-model="post.title">
            </div>
            <div class="form-group" :class="{ 'has-warning': bodyWarning }">
                <label class="control-label">內容
                    <span v-if="bodyWarning">不能空白</span>
                </label>
                <textarea class="form-control" v-model="post.body"></textarea>
            </div>
            <div class="form-group">
                <div v-if="isSave">
                    <button @click.prevent="save">儲存</button>
                    <button @click.prevent="cancel">取消</button>
                </div>
                <button v-else @click.prevent="publish">發佈</button>
            </div>
        </form>
    </div>
</template>
<script>
    import List from './List';
    export default {
        components: {
            List
        },
        data() {
            return {
                posts: [],
                post: {
                    id: null,
                    title: '',
                    body: ''
                },
                titleWarning: false,
                bodyWarning: false,
                isSave: false
            }
        },
        methods: {
            init: function () {
                let self = this;
                axios.get('/api/posts')
                    .then(function (response) {
                        self.posts  = response.data;
                    })
                    .catch(function (response) {
                        console.log(response);
                    });
            },
            publish: function () {
                this.titleWarning = (this.post.title.trim().length == 0);
                this.bodyWarning = (this.post.body.trim().length == 0);
                if (this.titleWarning || this.bodyWarning) return;
                //
                let self = this;
                axios.post('/api/posts', this.post)
                    .then(function (response) {
                        if (response.data['ok']) {
                            // self.init();
                            self.posts.push(response.data['thepost']); //新增成功的話載入剛剛新增成功的資料
                            self.titleWarning = false;
                            self.bodyWarning = false;
                            self.post = {id:null, title: '', body:''};
                        }
                    })
                    .catch(function (response) {
                        console.log(response)
                    });
            },
            modify: function (post) {
                location.href = "#form";
                this.post.id = post.id;
                this.post.title = post.title;
                this.post.body = post.body;
                this.isSave = true;
                console.log(this.post);
            },
            save: function () {
                let self = this;
                axios.put('/api/posts/' + this.post.id, this.post)
                    .then(function (response) {
                        if (response.data['ok']) {
                            // self.init();
                            let i;
                            let len = self.posts.length;
                            //更新成功後更新本地端資料
                            for (i = 0; i < len; i++) {
                                if (self.posts[i].id == self.post.id) {
                                    self.posts[i].title = self.post.title;
                                    self.posts[i].body = self.post.body;
                                    break;
                                }
                            }
                            self.isSave = false;
                            self.post = {id:null, title: '', body:''};
                        }
                    })
                    .catch(function (response) {
                        console.log(response);
                    });
            },

            cancel: function () {
                this.post = {id: null, title: '', body: ''};
                this.isSave = false;
            },
            remove: function (id) {
                let self = this;
                axios.delete('/api/posts/' + id)
                    .then(function (response) {
                        if (response.data['ok']) {
                            // self.init();
                            let i;
                            let len = self.posts.length;
                            //刪除本地端中的該項目
                            for (i = 0; i < len; i++) {
                                if (self.posts[i].id == id) {
                                    self.posts.splice(i, 1);
                                    break;
                                }
                            }
                        }
                    })
                    .catch(function (response) {
                        console.log(response);
                    });
            }
        },
        mounted: function () {
            this.init();
        }
    }
</script>

<style scoped>
    .fade-item {
        transition: all .5s ease;
    }

    .fade-item h1 {
        margin-top: 0;
    }

    #list {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 240px;
        padding: 20px;
        margin: 20px 0;
        overflow: scroll;
    }

    #form {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 20px;
        box-shadow: 0 6px 20px 0 #333333;
    }
</style>