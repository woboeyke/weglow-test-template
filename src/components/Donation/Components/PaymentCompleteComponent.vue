<template>
  <div class="text-center">
    <h5 class="text-h5">{{ title }}</h5>
    <p>{{ message }}</p>
    <p v-if="checkingPayment">{{ $t('checkingPayment') }}</p>
    <p>{{ $t('sharePayment') }}</p>
    <div class="row q-py-lg">
      <div class="col-12">
        <q-btn id="next-button" class="q-py-md" rounded color="primary" :label="$t('backToStart')" @click="goBack" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useCandleStore } from 'src/stores/CandleStore';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'PaymentCompleteComponent',
  setup() {
    const { t } = useI18n();
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');
    const orderStatusId = urlParams.get('orderStatusId');
    const paymentSessionId = urlParams.get('paymentSessionId');
    const paymentMethod = urlParams.get('paymentMethod');

    let message = '';
    let title = '';
    let checkingPayment = false;

    if (paymentMethod === 'payconiq') {
      message = t('payconiqMessage');
      title = t('payconiqTitle');
    } else {
      switch (orderStatusId) {
        case '50':
        case '95':
        case '100':
          message = t('paymentSuccessMessage');
          title = t('paymentSuccess');
          break;
        case '-90':
          message = t('paymentCancelledMessage');
          title = t('paymentCancelled');
          break;
        case '-63':
          message = t('paymentRefusedMessage');
          title = t('paymentRefused');
          break;
        case '85':
          message = t('paymentPendingMessage');
          title = t('paymentPending');
          break;
        default:
          message = t('paymentErrorMessage');
          title = t('somethingWentWrong');
          break;
      }
    }

    return {
      message: ref(message),
      title: ref(title),
      paymentDetails: ref({ orderId, orderStatusId, paymentSessionId, paymentMethod }),
      checkingPayment: ref(checkingPayment),
    };
  },
  methods: {
    checkPayment(isFirstTime = false) {
      if (!this.paymentDetails.orderId) {
        this.$router.push({ path: '/' });
        return;
      }

      this.checkingPayment = true;

      const candleStore = useCandleStore();
      candleStore.checkIfPaid({ orderId: this.paymentDetails.orderId }).then((response) => {
        if (response) {
          this.message = this.$t('paymentSuccessMessage');
          this.title = this.$t('paymentSuccess');
          this.checkingPayment = false;
        } else {
          if (isFirstTime) {
            this.message = this.$t('paymentErrorMessage');
            this.title = this.$t('somethingWentWrong');
            this.checkingPayment = false;
          } else {
            setTimeout(() => {
              this.checkPayment(true);
            }, 10000);
          }
        }
      });
    },
    goBack() {
      this.$router.push({ path: '/' });
    },
  },
  mounted() {
    if (this.paymentDetails.paymentMethod === 'payconiq') {
      return;
    }

    switch (this.paymentDetails.orderStatusId) {
      case '100':
        break;
      default:
        this.checkPayment();
        break;
    }
  },
});
</script>
