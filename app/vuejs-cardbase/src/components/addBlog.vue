<template>
  <div id="blogo">
  <h2>Add a New Blog Post</h2>
  <form v-if="!submitted">
    <label>Blog Title:</label>
    <input type="text" v-model.lazy="blog.title" required />
    <label>Blog Content:</label>
    <textarea v-model.lazy="blog.content"></textarea>
    <div id="checkboxes">
      <label>Extra Toppings</label>
      <input type="checkbox" value="toppings" v-model="blog.categories"/>
      <label>Extra Cheese</label>
      <input type="checkbox" value="cheese" v-model="blog.categories"/>
      <label>Iced Coffee</label>
      <input type="checkbox" value="coffee" v-model="blog.categories"/>
      <label>Extra Protein</label>
      <input type="checkbox" value="protein" v-model="blog.categories"/>
    </div>
    <label>Author:</label>
      <select v-model="blog.author">
        <option v-for="author in authors"> {{author}}</option>
      </select>
      <button v-on:click.prevent="post">Add Blog</button>
  </form>
  <div v-if="submitted">
    <h3>Thanks for adding your post!</h3>
  </div>
  <div id="preview">
    <h3>Preview Blog:</h3>
    <p>Blog Title: {{ blog.title }}</p>
    <p>Blog Content:</p>
    <p>{{ blog.content }}</p>
    <p>Blog Categories:</p>
    <ul>
      <li v-for="category in blog.categories"> {{category}} </li>
    </ul>
    <p>Author: {{blog.author}}</p>
  </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      blog: {
        title: '',
        content: '',
        categories: [],
        author: ''
      },
      authors: ['RickMayne', 'Timothy', 'Prestor'],
      submitted: false
    }
  },
  methods: {
    post: function (){
      this.$http.post('http://jsonplaceholder.typicode.com/posts',{
        title: this.blog.title,
        body: this.blog.content,
        userId: 1
      }).then(function(data){
        console.log(data);
      });
      this.submitted = true;
    }
  }
}
</script>

<style>
body{
  font-family: sans-serif;
}
#blogo{
  margin:20px auto;
  max-width: 600px;
}

label{
  display:block;
  margin: 20px 0 10px;
}

input[type="text"], textarea{
  display:block;
  width: 100%;
  padding: 8px;
}

#preview{
  padding: 10px 20px;
  border: 1px dotted #ccc;
  margin: 30px 0;
}

h3{
  margin-top: 10px;
}

#checkboxes input{
  display: inline-block;
  margin-right: 10px;
}

#checkboxes label{
  display: inline-block;
}
</style>