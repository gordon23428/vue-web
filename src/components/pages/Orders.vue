<template>
  <div>
    <loading :active.sync="isLoading"/>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">購買時間</th>
          <th width="150">Email</th>
          <th>購買款項</th>
          <th width="120">應付金額</th>
          <th width="100">是否付款</th>
        </tr>
      </thead>
      <tbody>
        
      </tbody>
    </table>
  </div>
</template>   

<script>
export default {
  data() {
    return {
      isLoading: false,
      orders: [],
    }
  },
  methods: {
    getOrders() {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/orders`
      console.log(api)
      const vm = this
      vm.isLoading = true
      this.$http.get(api).then((response) => {
      console.log(response.data)
      // vm.orders = response.data.products
      vm.isLoading = false
      // qvm.pagination = response.data.pagination
      })
    }
  },
  mounted() {
    this.getOrders()
  },
}
</script>