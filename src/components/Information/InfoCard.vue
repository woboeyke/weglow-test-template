<template>
  <div class="container infoContainer">
    <div class="InfoCard_img">
      <q-img :src="src" loading="lazy" alt="card-icon" spinner-color="deep-orange">
        <template v-slot:error>
          <div class="absolute-full flex flex-center bg-negative text-white">Cannot load image</div>
        </template>
      </q-img>
    </div>
  </div>
  <div class="InfoCard_text">
    <p>{{ prettyTotal }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'InfoCardComponent',
  props: {
    src: {
      type: String,
      required: true,
    },
    total: {
      type: String,
      required: true,
    },
  },
  computed: {
    prettyTotal(): string {
      // Add spaces between thousands
      return this.total.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    },
  },
});
</script>

<style lang="scss" scoped>
.InfoCard_img {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 12px;
  width: 100%;
}

.infoContainer {
  height: 73%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.InfoCard_text {
  display: flex;
  align-items: center;
  justify-content: center;
}
.InfoCard_text p {
  margin: 10px;
  font-size: 18px;
}

.InfoCard_img .q-img {
  width: 25%;
}

@media screen and (max-width: 992px) {
  .InfoCard_text p {
    margin: 10px 0;
    font-size: 16px;
  }

  .InfoCard_img .q-img {
    width: 90%;
    padding-bottom: 32px;
  }
}

@media screen and (max-width: 768px) {
  .InfoCard_img .q-img {
    width: 60%;
    padding-bottom: 24px;
  }
}

@media screen and (max-width: 576px) {
  .InfoCard_text p {
    margin: 10px;
    font-size: 14px;
  }

  .InfoCard_img .q-img {
    width: 80%;
    padding-bottom: 0;
  }
}
</style>
