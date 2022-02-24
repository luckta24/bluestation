<template>
    <div class="wrap">
      <h1>블루 스테이션</h1>
      <div>
        <router-link :to="{ name: 'AdminView' }">Admin</router-link>
      </div>
      <div class="contents-wrap">
        <section class="contents01">
          <div class="flip-card" v-for="(post, index) in posts.slice(0,1)" :key="index">
            <div class="flip-card-inner">
              <div class="flip-card-front">
                <img src="https://github.com/luckta24/bluestation/blob/main/img/1.jpg?raw=true" />
              </div>
              <div class="flip-card-back">
                <a :href="post.link" target="_blank">{{ post.contents }}</a>
              </div>
            </div>
          </div>
        </section>
        <section class="contents02">
          <div class="flip-card" v-for="(post, index) in posts.slice(1,3)" :key="index">
            <div class="flip-card-inner">
              <div class="flip-card-front">
                <img v-if="index === 0" src="https://github.com/luckta24/bluestation/blob/main/img/2.jpg?raw=true" />
                <img v-if="index === 1" src="https://github.com/luckta24/bluestation/blob/main/img/3.jpg?raw=true" />
              </div>
              <div class="flip-card-back">
                <a :href="post.link" target="_blank">{{ post.contents }}</a>
              </div>
            </div>
          </div>
        </section>
        <section class="contents03">
          <div class="flip-card" v-for="(post, index) in posts.slice(3)" :key="index">
            <div class="flip-card-inner">
              <div class="flip-card-front">
                <img v-if="index === 0" src="https://github.com/luckta24/bluestation/blob/main/img/4.jpg?raw=true" />
                <img v-if="index === 1" src="https://github.com/luckta24/bluestation/blob/main/img/5.jpg?raw=true" />
                <img v-if="index === 2" src="https://github.com/luckta24/bluestation/blob/main/img/6.jpg?raw=true" />
              </div>
              <div class="flip-card-back">
                <a :href="post.link" target="_blank">{{ post.contents }}</a>
              </div>
            </div>
          </div>
        </section>
      </div>
      <router-view />
    </div>
</template>

<script>
import { isProxy, toRaw } from 'vue';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import firebaseConfig from '../../firebase_config';

export default {
  name: "HomeView",
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
  computed:{
    orderedPosts: ()=> {
      return this.posts.sort(function (val1, val2){
        return val1.order < val2.order;
      });
    }
  },
}
</script>

<style scoped>
.wrap {
  padding: 50px 0;
}
.wrap h1 {
  text-align: center;
  font-size: 28px;
  margin: 0 0 100px;
}
.wrap h1 a {
  color: #000;
  text-decoration: none;
}
.contents-wrap {
  width: 100%;
  max-width: 1440px;
  margin: auto;
}
.contents-wrap:after {
  content: "";
  display: block;
  clear: both;
}
.contents-wrap section {
  float: left;
  height: 710px;
}
.contents-wrap section.contents01 {
  width: 50%;
}
.contents-wrap section.contents02 {
  width: 30%;
}
.contents-wrap section.contents03 {
  width: 20%;
}
.contents-wrap section .flip-card:first-child {
  margin-top: 0;
}
.contents-wrap section.contents01 .flip-card {
  height: 710px;
}
.contents-wrap section.contents02 .flip-card {
  height: calc(710px / 2 - 5px);
}
.contents-wrap section.contents03 .flip-card {
  height: calc(710px / 3 - 7.5px);
}

/*----------flip card animation--------*/
.flip-card {
  width: calc(100% - 10px);
  background-color: transparent;
  perspective: 1000px; /* Remove this if you don't want the 3D effect */
  margin: 10px 5px 0;
}
/* This container is needed to position the front and back side */
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}
/* Do an horizontal flip when you move the mouse over the flip box container */
.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}
/* Position the front and back side */
.flip-card-front, .flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
}
/* Style the front side (fallback if image is missing) */
.flip-card-front {
  background-color: #bbb;
  color: black;
}
.flip-card-front img {
  display: block;
  object-fit: cover;
  width: 100%;
  height: 100%;
}
/* Style the back side */
.flip-card-back {
  position: relative;
  width: calc(100% - 10%);
  height: 100%;
  background-color: dodgerblue;
  color: white;
  transform: rotateY(180deg);
  padding: 0 5%;
}
.flip-card-back a {
  position: absolute;
  top: 50%;
  left: 5%;
  width: 90%;
  color: #fff;
  font-size: 34px;
  text-decoration: none;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  /*말줄임*/
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

/*--------768px 해상도---------*/
@media screen and (max-width: 768px) {
  .contents-wrap section {
    float: none;
    height: fit-content;
  }
  .contents-wrap section.contents01, .contents-wrap section.contents02, .contents-wrap section.contents03 {
    width: 100%;
  }
  .contents-wrap section .flip-card {
    margin: 10px 5px 0 !important;
  }
  .contents-wrap section.contents02 .flip-card {
    float: left;
    width: calc(50% - 10px);
  }
  .contents-wrap section.contents03 .flip-card {
    float: left;
    width: calc(100% / 3 - 10px);
  }
}
</style>