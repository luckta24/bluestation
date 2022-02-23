<template>
  <div id="admin">
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
          <td>{{ index+1 }}</td>
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
</template>

<script>
import {initializeApp} from "firebase/app";
import {updateDoc, doc, getDoc, getFirestore} from "firebase/firestore";
import {isProxy, toRaw} from "vue";
import firebaseConfig from '../../firebase_config';

export default {
  name: "AdminView",
  data: function(){
    return {
      db: null,
      posts: [],
    }
  },
  methods: {
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

      // console.log(this.posts);
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
        });

      } catch (e) {
        console.error("Error set document: ", e);
      }
    },
  },
  mounted() {
    // Your web app's Firebase configuration
    // Initialize Firebase
    initializeApp(firebaseConfig);

    this.db = getFirestore();

    this.getDocs();

    // const usersRef = collection(this.db, "users");
    // console.log(usersRef);
  },
}
</script>

<style scoped>

</style>