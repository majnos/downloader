var cheerio = require('cheerio');

var html = '<div id="browse-results"> \
    <ul class="tips cf"> \
        <li>tip11</li> \
        <li>tip12</li> \
        <li>tip13</li> \
    </ul> \
    <ul class="tips cf"> \
        <li>tip21</li> \
        <li>tip22</li> \
        <li>tip23</li> \
    </ul> \
    <ul class="tips cf"> \
        <li>tip31</li> \
        <li>tip32</li> \
        <li>tip33</li> \
    </ul> \
    <ul class="tips cf"> \
        <li>tip41</li> \
        <li>tip42</li> \
        <li>tip43</li> \
    </ul> \
</div>';

var $ = cheerio.load(html);

$('#browse-results li').each(function(i, elm) {
    console.log($(this).text()) // for testing do text() 
});