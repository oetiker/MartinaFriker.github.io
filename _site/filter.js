jQuery(document).ready(function() {

    var ages_hash = {}; //hash weil jeder key im hash nur 1x vorkommen kann -> =sammlung von allen möglichen ages ohne wdh
    var categories_hash = {}; //hash mit allen vorkommenden kategorien ohne wdh
    var languages_hash = {}; // " sprachen
    var $Tools = jQuery(".tools"); //variable damit tools nicht Xmal geholt werden müssen


    $Tools.each(function() { //loop tools holen
        var $this = jQuery(this);

        var cat = $this.data("category"); //variable category aus data-jaml-files
        categories_hash[cat] = categories_hash[cat] + 1 || 1; // value im hash kategorie für jeden key = 1 (eigentlich egal was aber es braucht einen)

        var ages = $this.data("ages"); //variable ages aus data-jaml-file
        ages.forEach(function(age) { // wie bei kategorie aber pro tool hat es mehrere ages, darum loop
            ages_hash[age] = ages_hash[age] + 1 || 1;
        });

        var languages = $this.data("languages") //variable languages aus data-jaml-file
        languages.forEach(function(language) { //wie bei kategorie ages
            languages_hash[language] = languages_hash[language] + 1 || 1;
        });

    });

    console.log(categories_hash);

    var measure = function() {
        var height = 0;
        $Tools.css("height", "auto");
        window.setTimeout(function() {
            $Tools.each(function() {
                    var $tool = $(this);
                    if ($tool.parent().is(":hidden")) {
                        return this;
                    }
                    //-> jquery visible ?
                    height = Math.max(height, Math.round($tool.height()));

                    console.log(height);
                    return this;

                })
                .height(height);
        }, 0);
    };

    measure();



    var $choice = jQuery("#choice");

    var checked_hash = {};

    var tool_loop = function() {

        $Tools.each(function() { //loop tools holen

            var $this = jQuery(this);


            for (var group in checked_hash) {
                var content_found = false;
                for (var item in checked_hash[group]) { //schauen ob ein Element vohanden ist
                    content_found = true;
                }
                if (!content_found) { //wenn nichts gefunden
                    continue // zur nächsten Gruppe (zeile 55)
                }


                var value = $this.data(group);

                if (typeof value == "object") {
                    var found = false;
                    value.forEach(function(item) {
                        if (checked_hash[group][item]) {
                            found = true;
                        }
                    });
                    if (!found) {
                        $this.parent().hide();
                        return;
                    }
                } else if (!checked_hash[group][value]) {
                    $this.parent().hide();
                    return;
                }
            }

            $this.parent().show();

        });
        measure();
    };


    var myFunc = function(hash, filter, name) {

        let $line = jQuery("<tr class='filter_lines'> </tr>");

        $line.append('<td class="topic" VALIGN="TOP">' + name + '</td>');

        $choice.append($line);
        let $boxset = jQuery('<td class="boxset"></td>');
        $line.append($boxset);



        Object.keys(hash).sort().forEach(function(hash_key) {
            let $span = jQuery("<span class='checkbox'>").html("<input type='checkbox'/> " +
                hash_key + " <span class='counter'>(" + hash[hash_key] + ")</span>");
            $boxset.append($span);
            $span.on("click", function() {
                var $input = jQuery('input', $span);
                var checked = $input.is(":checked");
                if (!checked_hash[filter]) {
                    checked_hash[filter] = {};
                }

                if (checked) {
                    checked_hash[filter][hash_key] = true;
                } else {
                    delete checked_hash[filter][hash_key];
                }
                console.log(checked_hash);


                tool_loop()
            });
        });

    };

    myFunc(categories_hash, "category", "<strong>Kategorien: </strong> ");

    myFunc(ages_hash, "ages", "<strong> Alter: </strong>");

    myFunc(languages_hash, "languages", "<strong>Programmiersprachen: </strong> ");


});