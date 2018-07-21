<template>
    <div class="note-sidebar">
        <div class="note-sidebar-nav">
            <span class="btn add-note" @click="onAddNote">添加笔记</span>
            <el-dropdown class="notebook-title" @command="handleCommand" placement="bottom">
                <span class="el-dropdown-link">
                    {{curBook.title}}<i class="iconfont icon-down"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="notebook in notebooks" :command="notebook.id" :key="notebook.id">
                        {{notebook.title}}
                    </el-dropdown-item>
                    <el-dropdown-item command="trash">回收站</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div class="note-sidebar-content">
            <div class="menu">
                <div>更新时间</div>
                <div>标题</div>
            </div>
            <ul class="notes">
                <li v-for="note in notes">
                    <router-link :to="`/note?noteId=${note.id}&notebookId=${curBook.id}`">
                        <span class="date">{{note.updatedAtFriendly}}</span>
                        <span class="title">{{note.title}}</span>
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
    //    window.Notes = Notes

    export default {
        data() {
            return {}
        },
        computed: {
            ...mapGetters(['notebooks', 'notes', 'curBook', 'curNote'])
        },
        created() {
            this.getNotebooks().then(() => {
                this.setCurBook({curBookId: this.$route.query.notebookId})
                //this.$store.commit('setCurBook',{curBookId: this.$route.query.notebookId})
                return this.getNotes({notebookId: this.curBook.id})
            }).then(() => {
                this.setCurNote({curNoteId: this.$route.query.noteId})
                this.$router.replace({
                    path: '/note',
                    query: {
                        noteId: this.curNote.id,
                        notebookId: this.curBook.id
                    }
                })
            })
        },
        methods: {
            ...mapMutations(['setCurBook', 'setCurNote']),
            ...mapActions(['getNotebooks', 'getNotes', 'addNote']),
            handleCommand(notebookId) {
                if (notebookId === 'trash') {
                    return this.$router.push({path: '/trash'})
                }
                this.$store.commit('setCurBook', {curBookId: notebookId})
                this.getNotes({notebookId}).then(() => {
                    this.setCurNote()
                    this.$router.replace({
                        path: '/note',
                        query: {
                            noteId: this.curNote.id,
                            notebookId: this.curBook.id
                        }
                    })
                })
            },
            onAddNote() {
                this.$prompt('输入新笔记标题', '创建笔记', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^.{1,30}$/,
                    inputErrorMessage: '标题不能为空，且不能超过30个字符'
                }).then(({value}) => {
                    this.addNote({notebookId: this.curBook.id, title: value})
                })
            }
        }
    }
</script>
<style rel="stylesheet" lang="less" scoped>
    @import url(../assets/css/note-sidebar.less);
</style>