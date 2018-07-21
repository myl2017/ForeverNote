<template>
    <div id="note" class="detail">
        <note-sidebar @update:notes="val => notes = val"></note-sidebar>
        <div id="note-detail" class="note-detail">
            <div class="note-empty" v-show="!curNote.id">请选择笔记</div>
            <div class="note-ct" v-show="curNote.id">
                <div class="note-bar">
                    <span> 创建日期：{{curNote.createdAtFriendly}}</span>
                    <span> 更新日期：{{curNote.updatedAtFriendly}}</span>
                    <span> {{statusText}}</span>
                    <span class="iconfont icon-delete" @click="onDeleteNote"></span>
                    <span class="iconfont icon-view" @click="isShowPreview = !isShowPreview"></span>
                    <!--<span class="iconfont icon-edit" @click="isShowPreview = isShowPreview"></span>-->
                </div>
                <div class="note-title">
                    <input type="text" v-model:value="curNote.title" @input="onUpdateNote" @keyup="statusText='正在输入...'"
                           placeholder="输入标题">
                </div>
                <div class="editor">
                    <!--<codemirror v-model="curNote.content" :options="cmOptions" v-show="!isShowPreview" @input="onUpdateNote" @inputRead="statusText='正在输入...'"></codemirror>-->
                    <textarea v-show="isShowPreview" v-model:value="curNote.content" @input="onUpdateNote"
                              @keyup="statusText='正在输入...'"
                              placeholder="输入内容, 支持 markdown 语法"></textarea>
                    <div class="preview markdown-body" v-html="previewContent" v-show="!isShowPreview"></div>
                </div>
            </div>
            <!--<h1>params:{{$route.params.noteId}}</h1>-->
            <!--<h1>notebookId:{{$route.query.notebookId}}</h1>-->
            <!--<h1>noteId:{{$route.query.noteId}}</h1>-->
        </div>
    </div>
</template>
<script>
    import  NoteSidebar from '@/components/NoteSidebar'
    import  _  from  'lodash'
    import MarkdownIt from  'markdown-it'
    import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
    import { codemirror } from 'vue-codemirror'
    import 'codemirror/lib/codemirror.css'
    import 'codemirror/mode/markdown/markdown.js'
    import 'codemirror/theme/neat.css'
    //    var MarkdownIt = require('markdown-it'),
    //    md = new MarkdownIt();
    //    var result = md.render('# markdown-it rulezz!');
    let md = new MarkdownIt()

    export  default {
        name: 'NoteDetail',
        components: {
            NoteSidebar
        },
        data(){
            return {
                statusText: '未录入',
                isShowPreview: false
            }
        },
        created() {
            this.checkLogin({path: '/login'})
        },
        computed: {
            ...mapGetters(['notes', 'curNote']),
            previewContent() {
                return md.render(this.curNote.content || '')
            }
        },
        methods: {
            ...mapMutations(['setCurNote']),
            ...mapActions(['updateNote', 'deleteNote', 'checkLogin']),
            onUpdateNote: _.debounce(function () {
                if (this.curNote === null) return
                this.updateNote({noteId: this.curNote.id, title: this.curNote.title, content: this.curNote.content})
                    .then(res => {
                        this.statusText = '已保存'
                    }).catch(err => {
                    this.statusText = '保存出错'
                })

            }, 300),
            onDeleteNote() {
                this.deleteNote({noteId: this.curNote.id}).then(() => {
                    this.$router.replace({path: '/note'})
                })
            }
        },
        beforeRouteUpdate (to, from, next) {
            // 在当前路由改变，但是该组件被复用时调用
            // 举例来说，对于一个带有动态参数的路径 /note/:id，在 /note/1 和 /note/2 之间跳转的时候，
            // 由于会渲染同样的 NoteDetail 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
            // 可以访问组件实例 `this`
            this.setCurNote({curNoteId: to.query.noteId})
            //this.curNote = this.notes.find(note => note.id == to.query.noteId) || {}
            next()
        }
    }
</script>
<style rel="stylesheet/less" lang="less" scoped>
    @import url(../assets/css/note-detail.less);
    @import url(//at.alicdn.com/t/font_754780_nw3rw72dqx.css);
</style>