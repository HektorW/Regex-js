var methods ={
  exec: {
    name: 'Exec',
    object: 'regex'
  },
  test: {
    name: 'Test',
    object: 'regex'
  },

  match: {
    name: 'Match',
    object: 'string'
  },
  search: {
    name: 'Search',
    object: 'string'
  }
};


function parse() {
  var inputrgx = $('#input_regex').val() || "";
  var flags = $('#input_flags').val() || "g";
  var str = $('#input_string').val() || "";

  var rgx;

  try {
    rgx = new RegExp(inputrgx, flags);
  } catch(ex) {
    console.log('Exception caught');
    console.log(ex);
    return;
  }

  for(var m in methods) {
    var obj = methods[m];

    var data = {
      name: obj.name,
      code: getCode(m, rgx, str),
      result: getResult(m, rgx, str),
      template: 'result'
    };

    formatData(data);

    dust.render(data.template, data, render);
  }
}

function getCode(method, regex, string) {
  if(methods[method].object === 'regex') {
    return regex.toString() + "." + method + "(\"" + string + "\")";
  }
  else {
    return '"' + string + "\"." + method + "(" + regex.toString() + ")";
  }
}

function getResult(method, regex, string) {
  var obj = methods[method];

  if(obj.object === 'regex') {
    if(regex.global) {
      var o = {
        iterations: []
      };
      var r;
      while((r = regex[method](string)) !== null) {
        o.iterations.push(r);

        // When lastIndex == 0 we have either got stuck or looped
        if(regex.lastIndex === 0)
          break;
      }
      return o;
    }

    return regex[method](string);
  }
  else {
    return string[method](regex);
  }
}

function formatData(data) {
  var result = data.result;

  if(result === null) {
    data.result = 'null';
    data.class = 'false';
    return;
  }

  switch(typeof result) {
    case 'boolean': {
      // Convert to string so it shows properly
      data.result = result.toString();
      data.class = result.toString();
    } break;
    case 'number': {
      if(result === -1)
        data.class = 'false';
    } break;
  }
}

function render(err, out) {
  if(err)
    alert(err);

  var name = $(out).attr('data-name');
  var element = $('.results [data-name='+name+']');

  if(!element.length)
    $('.results').append(out);
  else
    element.replaceWith(out);
}


// Ready
$(function() {
  $('#input_regex, #input_string').on('input', parse);
  $('#input_flags').on('input', function(ev) {
    parse();
  });

  // parse();
});
