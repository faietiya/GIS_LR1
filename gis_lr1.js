var myMap;

// Дождёмся загрузки API и готовности DOM.
ymaps.ready(init);

var scheme = {
  'Дзержинский район': {
    '1268696': "0FF",
  },
  'Индустриальный район': {
    '1268694': "0FF",
  },
  'Кировский район': {
    '1268698': "0FF",
  },
  'Ленинский район': {
    '1268697': "0FF",
  },
  'Мотовилихинский район': {
    '1268693': "0FF",
  },
  'Орджоникидзевский район': {
    '1268692': "0FF",
  },
  'Свердловский район': {
    '1268699': "0FF",
  },
};

function importCSV(scheme, csv, name) {
  var lines = csv.split('\n');
  var result = {};
  console.log(lines);
  for (var i in lines) {
    var line = lines[i].split(',');
    if (line[1]) {
      result[line[0].trim()] = line[1].trim();
    }
  }
  scheme[name] = result;
}

function init() {
  importCSV(scheme, document.getElementById('csv').value, 'Город полностью');

// Создание экземпляра карты и его привязка к контейнеру с
// заданным id ("map").
  myMap = new ymaps.Map('map', {

// При инициализации карты обязательно нужно указать
// её центр и коэффициент масштабирования.
    center: [58.0149643, 56.2467244],
    zoom: 10
  }, {
    searchControlProvider: 'yandex#search'
  });
  var geoMap = myMap,
    collection = 0;

  function setColors(countryColors) {
    collection.setStyles(function(object, yobject) {
      var color = false;
      if (typeof countryColors == 'function') {
        color = countryColors(object);
      } else {
        var openStreetMapId = object.properties.properties.openStreetMapId;
        color = countryColors[openStreetMapId];
      }
      return ({
        fillColor: color || '#6699ff',
        strokeColor: color ? '#000' : "00F",
        strokeWidth: 0.5,
        interactivityModel: 'default#transparent',
        opacity: 0.7

      });
    });

  }

  var listItems = [];
  for (var i in scheme) {
    (function(i) {
      var listItem = new ymaps.control.ListBoxItem(i);
      listItem.events.add('click', function() {
        setColors(scheme[i]);
        listBox.collapse();
      });
      listItems.push(listItem);
    })(i);
  }
  var setList = new ymaps.control.ListBox({
      data: {
        content: 'Выбрать район'
      },
      items: listItems
    }
  );

  geoMap.controls.add(setList, {
    floatIndex: 0
  });

  osmeRegions.geoJSON(1084793, {
    lang: 'ru',
    quality: 3,
    type: 'coast'
  }, function(data, pure) {
    collection = osmeRegions.toYandex(data, ymaps);
    collection.add(geoMap);
    geoMap.setBounds(collection.collection.getBounds(), {
      duration: 300
    });
  });
}
