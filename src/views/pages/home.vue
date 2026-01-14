<template>
  <div class="homePageContainer">
    <div class="topContainer"><TopSection /></div>
    <div class="bottomContainer">
      <BottomSection />
    </div>
  </div>
</template>

<script setup lang="ts">
import TopSection from '@/views/components/home/top_section.vue';
import BottomSection from '@/views/components/home/bottom_section.vue';
</script>

<style scoped>
.homePageContainer {
  background-color: red;
  height: 100%;
  width: 100%;
}

.topContainer {
  background-color: yellow;
  height: 60%;
  width: 100%;
}

.bottomContainer {
  background-color: orange;
  height: 40%;
  width: 100%;
  overflow: scroll;
}
</style>
