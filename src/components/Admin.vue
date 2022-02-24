<template>
  <div id="admin">
    <div v-show="!loginOk">
      <input type="name" v-model="userId" placeholder="ID를 입력해주세요.">
      <input type="password" v-model="userPw" placeholder="비밀번호를 입력해주세요.">
      <button @click="login()">Login</button>
      <div>
          <small style="color:red;">{{ loginErrMsg }}</small>
      </div>
    </div>
    <div v-show="loginOk">
      <div>
        <router-link :to="{ name: 'HomeView' }">돌아가기</router-link>
      </div>
      <div>
        <button @click="saveAll()">한번에 저장</button>
      </div>
      <table>
        <thead>
        <th>순서</th>
        <th>타이틀</th>
        <th>내용</th>
        <th>링크</th>
        <th>저장</th>
        </thead>
        <tbody>
        <tr v-for="(post, index) in posts" :key="index">
          <td>
            <div>
              <span v-if="index > 0" @click="moveUp(index)">▲</span>
              <span v-if="index != posts.length-1" @click="moveDown(index)">▼</span>
            </div>
          </td>
          <td>
            <input type="text" v-model="post.title">
          </td>
          <td>
            <textarea name="" id="" v-model="post.contents" cols="30" rows="10"></textarea>
          </td>
          <td>
            <input type="text" v-model="post.link">
          </td>
          <td>
            <button @click="saveDoc(post, index)">저장</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {initializeApp} from "firebase/app";
import {updateDoc, doc, getDoc, getFirestore} from "firebase/firestore";
import {isProxy, toRaw} from "vue";
import firebaseConfig from '../../firebase_config';
import adminConfig from '../../admin_config';

export default {
  name: "AdminView",
  data: function(){
    return {
      db: null,
      posts: [],
      userId: '',
      userPw: '',
      loginOk: false,
      loginErrMsg: '',
    }
  },
  methods: {
    login() {
        if(this.userId !== adminConfig.id) {
          this.loginErrMsg = '올바른 ID가 아닙니다. x_x';
          return false;
        }
        if(this.userPw !== adminConfig.pw) {
          this.loginErrMsg = '올바른 비밀번호가 아닙니다. x_x';
          return false;
        }

        if(this.userId === adminConfig.id && this.userPw === adminConfig.pw){
            this.loginOk  = true;
            this.loginErrMsg = '';
            localStorage.setItem('loginOk', this.loginOk);
        }
    },
    async getDocs() {
      for(let i=1; i<=6; i++) {
        const docRef = doc(this.db, "posts", String(i));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // console.log("Document data:", docSnap.data());
          let { title, contents, link } = docSnap.data();
          this.posts.push({
            title, contents, link
          });

        } else {
          this.posts.push({
            title: '',
            contents: '',
            link: '',
          });
        }
      }

      console.log(this.posts);
      if(isProxy(this.posts)){ //this If() block is not really necessary
        toRaw(this.posts);
      }
    },
    async saveDoc(post, index) {
      try {
        const washingtonRef = doc(this.db, "posts", String(index+1));
        // console.log(washingtonRef);
        // Set the "capital" field of the city 'DC'
        await updateDoc(washingtonRef, {
          title: post.title,
          contents: post.contents,
          link: post.link || '',
          order: index
        });

      } catch (e) {
        console.error("Error set document: ", e);
      }
    },
    saveAll() {
      this.posts.forEach((post, index)=>{
          this.saveDoc(post, index);
      });
    },
    moveUp(index) {
      let prevPostTemp = this.posts[index-1];
      this.posts[index-1] = this.posts[index];
      this.posts[index] = prevPostTemp;
    },
    moveDown(index) {
      let nextPostTemp = this.posts[index+1];
      this.posts[index+1] = this.posts[index];
      this.posts[index] = nextPostTemp;
    }
  },
  mounted() {
    // Your web app's Firebase configuration
    // Initialize Firebase
    initializeApp(firebaseConfig);

    this.db = getFirestore();

    this.getDocs();

    // const usersRef = collection(this.db, "users");
    // console.log(usersRef);

    if(localStorage.getItem('loginOk')) {
      this.loginOk = localStorage.getItem('loginOk');
    }
  },
}
</script>

<style scoped>

</style>