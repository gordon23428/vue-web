<template>
  <div>
    <loading :active.sync="isLoading"/>
    <div class="text-right mt-4">
      <button class="btn btn-primary" @click="openModal(true)">建立新優惠卷</button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>名稱</th>
          <th width="150">折扣百分比</th>
          <th width="150">到期日</th>
          <th width="120">是否啟用</th>
          <th width="100">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item) in coupons" :key="item.id">
          <td>{{item.title}}</td>
          <td>
            {{item.percent}}
          </td>
          <td>
            {{item.due_date}}
          </td>
          <td>
            <span v-if="item.is_enabled" class="text-success">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>
            <button class="btn btn-outline-primary btn-sm" @click="openModal(false, item)">編輯</button>
          </td>
          <td>
            <button class="btn btn-outline-danger btn-sm" @click="deleteModal(true, item)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
     <!-- Couponmodal -->
    <div class="modal fade" id="couponModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">新增優惠卷</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label for="title" class="col-form-label">標題</label>
                <input type="text" class="form-control" id="title" v-model="tempCoupon.title">
              </div>
              <div class="mb-3">
                <label for="coupon-text" class="col-form-label">優惠碼</label>
                <input type="text" class="form-control" id="coupon-text" v-model="tempCoupon.code">
              </div>
              <div class="mb-3">
                <label for="date" class="col-form-label">到期日</label>
                <input type="date" class="form-control" id="date" v-model="tempCoupon.due_date">
              </div>
              <div class="mb-3">
                <label for="percent" class="col-form-label">折扣百分比</label>
                <input type="text" class="form-control" id="percent" v-model="tempCoupon.percent">
              </div>
              <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" v-model="tempCoupon.is_enabled">
              <label class="form-check-label" for="flexCheckDefault">
                是否啟用
              </label>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="updatedCoupon">確認</button>
          </div>
        </div>
      </div>
    </div>
    <!-- deleteModal -->
    <div class="modal fade" id="delCouponModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除優惠卷</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除 <strong class="text-danger">{{ tempCoupon.title }}</strong> 優惠卷(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal" @click="deleteModal(false)">取消</button>
            <button type="button" class="btn btn-danger"
              @click="deleteCoupon()">確認刪除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  data() {
    return {
      isLoading: false,
      tempCoupon: {},
      coupons: [],
      due_date: new Date(),
      isNew: false,
      delId: '',
    }
  },methods: {
    updatedCoupon() {
      const vm = this
      let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon`
      let httpMethod = 'post'
      if (!vm.isNew) {
        api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`
        httpMethod = 'put'
      }
      vm.unix('timestamp')
      this.$http[httpMethod](api, { data: vm.tempCoupon }).then((response) => {
        if( response.data.success ) {
           console.log(response.data)
          $('#couponModal').modal('hide')
          vm.getCoupons()
        }else{
          $('#couponModal').modal('hide')
          vm.getCoupons()
          console.log('新增失敗')
        }
      })
    },
    getCoupons(page = 1) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupons?page=${page}`
      const vm = this
      vm.isLoading = true
      this.$http.get(api).then((response) => {
      console.log(response.data.coupons)
      vm.coupons = []
      response.data.coupons.forEach(item => {
        item.due_date = vm.unix('date', item.due_date)
        vm.coupons.push(item)
      })
      vm.isLoading = false
      

      })
    },
    openModal(isNew, item) {
      $('#couponModal').modal('show')
      if (isNew) {
        this.tempCoupon = {}
        this.isNew = true
      } else {
        this.tempCoupon = Object.assign({}, item )

        this.isNew = false
      }
    },
    deleteCoupon() {
      const vm = this
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.delId}`
      this.$http.delete(api).then((response) => {
      console.log(response.data)
      $('#delCouponModal').modal('hide')
      vm.getCoupons()
      })
    },
    deleteModal(mod, item) {
      if (mod) {
        $('#delCouponModal').modal('show')
        this.delId = item.id
      } else {
         $('#delCouponModal').modal('hide')
      }
    },
    unix(mod, item) {
      const vm = this
      if(mod === 'timestamp') {
        const timestamp = Math.floor(new Date(vm.tempCoupon.due_date) / 1000)
        vm.tempCoupon.due_date = timestamp
        console.log(timestamp)
      } else if (mod === 'date') {
        const dateAndTime = new Date(item * 1000).toISOString().split('T')
        return dateAndTime[0]
      }
      
      
    }

  },
  created() {
      this.getCoupons()
  },
}
</script>