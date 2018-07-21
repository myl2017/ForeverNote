<template>
    <div class="detail" id="notebook-list">
        <header>
            <a href="#" class="btn" @click.prevent="onCreate"> <i class="iconfont icon-plus"></i>新建笔记本 </a>
        </header>
        <main>
            <div class="layout">
                <h3>笔记本列表({{notebooks.length}})</h3>
                <div class="book-list">
                    <router-link v-for="notebook in notebooks" :to="`/note?notebookId=${notebook.id}`" class="notebook"
                                 :key="notebook.id">
                        <div>
                            <span class="iconfont icon-notebook"><h3>{{notebook.title}}</h3></span>
                            <span>{{notebook.noteCounts}}</span>
                            <span class="action" @click.stop.prevent="onEdit(notebook)">编辑</span>
                            <span class="action" @click.stop.prevent="onDelete(notebook)">删除</span>
                            <span class="date">{{notebook.createdAtFriendly}}</span>
                        </div>
                    </router-link>
                </div>
            </div>
        </main>
    </div>
</template>
<script>
    import  {friendlyDate} from '@/helpers/util'
    import {mapState, mapActions, mapGetters} from 'vuex'
    // window.NoteBooks = NoteBooks

    export  default {
        name: 'NoteBooksList',
        data(){
            return {}
        },
        created() {
            this.checkLogin({path: '/login'})

            this.getNotebooks()
        },
        computed: {
            ...mapGetters(['notebooks'])
        },
        methods: {
            ...mapActions(['addNotebook', 'updateNotebook', 'deleteNotebook', 'checkLogin', 'getNotebooks']),
            onCreate(){
                this.$prompt('输入新笔记本标题', '创建笔记本', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^.{1,30}$/,
                    inputErrorMessage: '标题不能为空，且不能超过30个字符'
                }).then(({value}) => {
                    this.addNotebook({title: value})
                })
            },
            onEdit(notebook){
                let title = ''
                this.$prompt('输入新笔记本标题', '编辑笔记本', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^.{1,35}$/,
                    inputValue: notebook.title,
                    inputErrorMessage: '标题不能为空，且不能超过30个字符'
                }).then(({value}) => {
                    title = value
                    this.updateNotebook({notebookId: notebook.id, title})
                })
            },
            onDelete(notebook){
                this.$confirm('你确定要删除吗?', '删除笔记本', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteNotebook({notebookId: notebook.id})
                })
            }
        }
    }
</script>
<style rel="stylesheet/less" lang="less" scoped>
    @import url(../assets/css/notebook-list.less);
</style>