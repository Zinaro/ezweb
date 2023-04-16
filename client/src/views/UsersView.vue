<template>
  <div class="users">
    <h1>Users list</h1>
    <Users></Users>
  </div>
</template>
<script>
// @ is an alias to /src
import Users from '@/components/Users.vue'

export default {
  name: 'UsersView',
  components: {
    Users
  }
}
</script>
