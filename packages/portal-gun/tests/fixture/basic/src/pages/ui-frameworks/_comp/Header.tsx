export default () => (
	<header>
		<portal-gate to="start:#content">
			<p>Prepended from header</p>
		</portal-gate>
		<p>Header</p>
		<portal-gate to="end:#content">
			<p>Appended from header</p>
		</portal-gate>
	</header>
);
