install:
	helm -n blog upgrade frontend . -f local.values.yaml --create-namespace --install --kube-context kiila

uninstall:
	helm -n blog uninstall frontend --kube-context kiila