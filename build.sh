SOURCES="false"
HTML="false"
SASS="false"

if [ $# -eq 0 ]
then
	SOURCES="true"
	HTML="true"
	SASS="true"
fi

while getopts "hsxa" OPTION; do
	case $OPTION in
		s)
		SOURCES="true"
		;;

		x)
		HTML="true"
		;;

		a)
		SASS="true"
		;;

		h)
		echo "Usage:"
		echo "-s	build sources"
		echo "-x	build html"
		echo "-a	build sass"
		echo "nothing	equivalent to -sxa"
		echo "-h	help (this output)"
		exit 0
		;;

		\?)
		echo "Invalid option: -$OPTARG" >&2
		;;
	esac
done

echo "===================runing builds=====================";
if [ $SOURCES = "true" ]
then
	echo "sources" &&
	browserify app.js -o dist/src.js;
fi

if [ $HTML = "true" ]
then
	echo "html" &&
	cp index.html dist/index.html;
fi

if [ $SASS = "true" ]
then
	echo "sass" &&
	sass app.scss dist/style.css;
fi
