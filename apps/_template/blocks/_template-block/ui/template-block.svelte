<script lang="ts">
  import { getTemplateBlockStatus } from '../index';

  const status = getTemplateBlockStatus();
</script>

<section aria-label="Template block">
  <h2>Template Block</h2>
  <p>Status: {status}</p>
</section>
