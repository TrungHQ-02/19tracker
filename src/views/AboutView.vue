<template>
  <div class="about">
    <h1>{{ developer }}</h1>
    <p>{{ university }}</p>
    <img :src="image" alt="whale" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      developer: "Hoàng Quốc Trung",
      university: "Đại học Bách Khoa Hà Nội",
      image:
        "https://th.bing.com/th/id/R.180ea72968aa46a00fb0dff5962135ea?rik=RU2sqti8Yjk7Pw&riu=http%3a%2f%2fwallpapercave.com%2fwp%2faFWhI85.jpg&ehk=N25u9yFYoab41uENxOa0KQC%2fAeSAPR7XL7UiK0bM2L8%3d&risl=&pid=ImgRaw&r=0",
    };
  },
};
</script>

<style>
.about {
  text-align: center;
}

img {
  width: 800px;
}
</style>
