<template>
    <div class="not-found">
        <i class="fas fa-exclamation-triangle noticon"></i>
      <h1>404 - Rûpel Nehat Dîtin..</h1>
      <p>Biborin. Rûpela ku tu lê digerî nehat dîtin..</p>
    </div>
  </template>

  <script>
export default{
  name: 'NotFoundPage',
  created() {
    document.title = '404 - Rûpel Nehat Dîtin..';
  }
};

</script>
  <style>
.not-found {
    background-color: var(--colorbg);
    color: var(--colortext);
    border-radius: 20px;
    box-shadow: var(--shadow);
    padding: 30px;
    font-style: italic;
}
.noticon {
    font-size: 108px;
    margin-bottom: 20px;
}
</style>
