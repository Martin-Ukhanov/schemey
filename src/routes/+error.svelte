<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="flex-1 flex flex-col justify-center items-center gap-y-2">
	<h1 class="text-6xl">{$page.status}</h1>
	<p>{$page.error?.message}</p>
</div>
