define(['src/openrosa-xpath-extensions', 'src/extended-xpath', 'chai', 'lodash'], function(openRosaXpathExtensions, ExtendedXpathEvaluator, chai, _) {
  var TODO = function() { false && assert.notOk('TODO'); },
      assert = chai.assert,
      doc, xEval,
      extendedXpathEvaluator = new ExtendedXpathEvaluator(
          function wrappedXpathEvaluator(xpath) {
            var v = xpath.v.trim();
            console.log('wrappedXpathEvaluator() :: xpath         =' + JSON.stringify(xpath));
            if(/^-?[0-9]+(\.[0-9]+)?$/.test(v)) {
              return { t:'num', v:parseFloat(v) };
            }
            console.log('wrappedXpathEvaluator() ::              v=' + JSON.stringify(v));
            var evaluated = doc.evaluate.call(doc, v, doc, null,
                XPathResult.STRING_TYPE, null);
            console.log('wrappedXpathEvaluator() ::      evaluated=' + evaluated);
            console.log('wrappedXpathEvaluator() ::      evaluated.resultType=' + evaluated.resultType);
            switch(evaluated.resultType) {
              case XPathResult.TYPE_NUMBER: return { t:'num', v:evaluated.numberValue };
              default: return { t:'str', v:evaluated.stringValue };
            }
          },
          openRosaXpathExtensions);
      simpleValueIs = function(textValue) {
        var xml = '<simple><xpath><to><node>' + textValue +
                '</node></to></xpath><empty/></simple>';
        doc = new DOMParser().parseFromString(xml, 'application/xml');
        xEval = function(e) {
          return extendedXpathEvaluator.evaluate(e);
        }
      },
      initBasicXmlDoc = function() { simpleValueIs(''); };

  beforeEach(function() {
    initBasicXmlDoc();
  });

/*
  describe('openrosa-xpath', function() {
    it('should process simple xpaths', function() {
      // given
      simpleValueIs('val');

      // expect
      assert.equal(xEval('/simple/xpath/to/node').stringValue, 'val');
    });

    describe('#concat', function() {
      it('should concatenate two xpath values', function() {
        // given
        simpleValueIs('jaja');

        // expect
        assert.equal(xEval('concat(/simple/xpath/to/node, /simple/xpath/to/node)').stringValue,
            'jajajaja');
      });
      it('should concatenate two string values', function() {
        // expect
        assert.equal(xEval('concat("port", "manteau")').stringValue,
            'portmanteau');
      });
      it('should concatenate a string and an xpath value', function() {
        // given
        simpleValueIs('port');

        // expect
        assert.equal(xEval('concat(/simple/xpath/to/node, "manteau")').stringValue,
            'portmanteau');
      });
      it('should concatenate an xpath and a string value', function() {
        // given
        simpleValueIs('port');

        // expect
        assert.equal(xEval('concat(/simple/xpath/to/node, "manteau")').stringValue,
            'portmanteau');
      });
    });

    describe('#date-time()', function() {
      describe('valid date string', function() {
        it('should be left alone', function() {
          assert.equal(xEval("date-time('1970-01-01')").stringValue, '1970-01-01');
        });
      });

      describe('valid date-time string', function() {
        it('should be converted to date string', function() {
          assert.equal(xEval("date-time('1970-01-01T21:50:49Z')").stringValue, '1970-01-01');
        });
      });

      describe('positive number', function() {
        _.forEach({
          'date-time(0)': '1970-01-01',
          'date-time(1)': '1970-01-02',
        }, function(expected, expr) {
          it(expr + ' should be converted to ' + expected, function() {
            assert.equal(xEval(expr).stringValue, expected);
          });
        });
      });

      describe('invalid date-time', function() {
        it('should not parse', function() {
          assert.equal(xEval("date-time('nonsense')").stringValue, 'Invalid Date');
        });
      });
    });

    describe('#date()', function() {
      describe('valid date string', function() {
        it('should be left alone', function() {
          assert.equal(xEval("date('1970-01-01')").stringValue, '1970-01-01');
        });
      });

      describe('positive number', function() {
        _.forEach({
          'date(0)': '1970-01-01',
          'date(1)': '1970-01-02',
        }, function(expected, expr) {
          it(expr + ' should be converted to ' + expected, function() {
            assert.equal(xEval(expr).stringValue, expected);
          });
        });
      });

      describe('invalid date', function() {
        it('should not parse', function() {
          assert.equal(xEval("date('nonsense')").stringValue, 'Invalid Date');
        });
      });

      describe('comparisons', function() {
        _.forEach({
            'date("2001-12-26") > date("2001-12-25")': true,
            'date("2001-12-26") < date("2001-12-25")': false,
            'date("1969-07-20") < date("1969-07-21")': true,
            'date("1969-07-20") > date("1969-07-21")': false,
            'date("2004-05-01") = date("2004-05-01")': true,
            'date("2004-05-01") != date("2004-05-01")': false,
            '"string" != date("1999-09-09")': true,
            '"string" = date("1999-09-09")': false,
            'date(0) = date("1970-01-01")': true,
            'date(0) != date("1970-01-01")': false,
            'date(1) = date("1970-01-02")': true,
            'date(1) != date("1970-01-02")': false,
            'date(-1) = date("1969-12-31")': true,
            'date(-1) != date("1969-12-31")': false,
            'date(14127) = date("2008-09-05")': true,
            'date(14127) != date("2008-09-05")': false,
            'date(-10252) = date("1941-12-07")': true,
            'date(-10252) != date("1941-12-07")': false,
            'date("2012-01-01") < today()': true,
            'date("2012-01-01") > today()': false,
            'date("2100-01-02") > today()': true,
            'date("2100-01-02") < today()': false,
        }, function(expected, expr) {
          it('should evaluate \'' + expr + '\' to: ' + expected, function() {
            assert.equal(xEval(expr).booleanValue, expected);
          });
        });
      });
    });*/

    describe('#number()', function() {
      describe('called on a date string', function() {
        _.forEach({
            'number("1970-01-01")': '0',
            'number("1970-01-02")': '1',
            'number("1969-12-31")': '-1',
            'number("2008-09-05")': '14127',
            'number("1941-12-07")': '-10252',
            'number("2008-09-05")': '14127',
        }, function(expectedResult, expr) {
          it(expr + ' should be ' + expectedResult + ' days since the epoch', function() {
          });
        });
      });
    });

    describe('#decimal-date()', function() {
      _.forEach({
        'decimal-date("1970-01-01")' : 0,
        'decimal-date("1970-01-02")' : 1,
        'decimal-date("1969-12-31")' : -1,
      }, function(expectedDaysSinceEpoch, expr) {
        it('should convert ' + expr + ' into ' + expectedDaysSinceEpoch, function() {
          assert.equal(xEval(expr).numberValue, expectedDaysSinceEpoch);
        });
      });
    });

    describe('#decimal-date-time()', function() {
      _.forEach({
        'decimal-date-time("1970-01-01T00:00:00Z")' : 0,
        'decimal-date-time("1970-01-02T00:00:00Z")' : 1,
        'decimal-date-time("1969-12-31T00:00:00Z")' : -1,
      }, function(expectedDaysSinceEpoch, expr) {
        it('should convert ' + expr + ' into ' + expectedDaysSinceEpoch, function() {
          assert.equal(xEval(expr).numberValue, expectedDaysSinceEpoch);
        });
      });
    });

    describe('#pow()', function() {
      describe('should return power of text values', function() {
        it('3^0', function() {
          // given
          simpleValueIs('3');

          assert.equal(xEval('pow(/simple/xpath/to/node, 0)').numberValue, 1);
        });
        it('1^3', function() {
          // given
          simpleValueIs('1');

          assert.equal(xEval('pow(/simple/xpath/to/node, 3)').numberValue, 1);
        });
        it('4^2', function() {
          // given
          simpleValueIs('4');

          assert.equal(xEval('pow(/simple/xpath/to/node, 2)').numberValue, 16);
        });
      });
    });

    describe('#indexed-repeat()', function() { it('should have tests', function() { TODO(); }); });

    describe('#format-date()', function() {
      _.forEach({
        'format-date("2001-12-31", "%b %e, %Y")': 'Dec 31, 2001',
      }, function(expected, expr) {
        it(expr + ' should evaluate to ' + expected, function() {
          assert.equal(xEval(expr).stringValue, expected);
        });
      });
    });

    describe('#format-date-time()', function() {
      _.forEach({
        'format-date-time("2001-12-31", "%b %e, %Y")': 'Dec 31, 2001',
      }, function(expected, expr) {
        it(expr + ' should evaluate to ' + expected, function() {
          assert.equal(xEval(expr).stringValue, expected);
        });
      });
    });

    describe('#coalesce()', function() {
      it('should return first value if provided via xpath', function() {
        // given
        simpleValueIs('first');

        // expect
        assert.equal(xEval('coalesce(/simple/xpath/to/node, "whatever")').stringValue,
            'first');
      });
      it('should return first value if provided via string', function() {
        // expect
        assert.equal(xEval('coalesce("FIRST", "whatever")').stringValue,
            'FIRST');
      });
      it('should return second value from xpath if first value is empty string', function() {
        // given
        simpleValueIs('second');

        // expect
        assert.equal(xEval('coalesce("", /simple/xpath/to/node)').stringValue,
            'second');
      });
      it('should return second value from string if first value is empty string', function() {
        // expect
        assert.equal(xEval('coalesce("", "SECOND")').stringValue, 'SECOND');
      });
      it('should return second value from xpath if first value is empty xpath', function() {
        // given
        simpleValueIs('second');

        // expect
        assert.equal(xEval('coalesce(/simple/empty, /simple/xpath/to/node)').stringValue,
            'second');
      });
      it('should return second value from string if first value is empty xpath', function() {
        // given
        simpleValueIs('');

        // expect
        assert.equal(xEval('coalesce(/simple/xpath/to/node, "SECOND")').stringValue,
            'SECOND');
      });
    });

    describe('#join()', function() { it('should have tests', function() { TODO(); }); });
    describe('#max()', function() { it('should have tests', function() { TODO(); }); });
    describe('#min()', function() { it('should have tests', function() { TODO(); }); });

    describe('#random()', function() {
      it('should return a number', function() {
        var vals = [];
        _.times(10, function() {
          // when
          var val = xEval('random()').numberValue;

          // then
          assert.typeOf(val, 'number');

          vals.push(val);
        });

        // check the numbers are a bit random
        assert.equal(_.uniq(vals).length, vals.length);
      });
    });

    describe('#substr()', function() {
      it('should give the rest of a string if supplied with only startIndex', function() {
        // given
        simpleValueIs('0123456789');

        // expect
        assert.equal(xEval('substr(/simple/xpath/to/node, 5)').stringValue,
            '56789');
      });
      it('should give substring from start to finish if supplied with 2 indexes', function() {
        // given
        simpleValueIs('0123456789');

        // expect
        assert.equal(xEval('substr(/simple/xpath/to/node, 2, 4)').stringValue,
            '23');
      });
    });

    describe('#int()', function() {
      it('should convert a string to an integer', function() {
        // given
        simpleValueIs('123');

        // then
        assert.equal(xEval('int(/simple/xpath/to/node)').numberValue, 123);
      });
      it('should convert a decimal to an integer', function() {
        // given
        simpleValueIs('123.456');

        // then
        assert.equal(xEval('int(/simple/xpath/to/node)').numberValue, 123);
      });
      // TODO it's not clear from the spec what else this should do
    });

    describe('#uuid()', function() {
      it('should provide an RFC 4122 version 4 compliant UUID string', function() {
        // when
        var provided = xEval('uuid()');

        // then
        assert.match(provided.stringValue,
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
      });
    });

    describe('#regex()', function() {
      it('should return `true` if value matches supplied regex', function() {
        // given
        simpleValueIs('123');

        // expect
        assert.ok(xEval('regex(/simple/xpath/to/node, "[0-9]{3}")').booleanValue);
      });
      // This test assumes that regex matching is for the whole value, so start
      // and end marks do not need to be included.  This seems logical, but is
      // not explicitly stated in the spec.
      it('should return `false` if value matches supplied regex', function() {
        // given
        simpleValueIs('1234');

        // expect
        assert.ok(xEval('regex(/simple/xpath/to/node, "[0-9]{3}")').booleanValue);
      });
    });

    describe('#now()', function() {
      it('should return a timestamp for this instant', function() {
        var before = Date.now(),
            val = xEval('now()').numberValue,
            after = Date.now();

        assert.ok(before <= val && after >= val);
      });
    });

    describe('#today()', function() {
      it('should return today\'s date', function() {
        // given
        var today = new Date(),
            zeroPad = function(n) { return n >= 10 ? n : '0' + n; };
        today = today.getFullYear() + '-' + zeroPad(today.getMonth()+1) + '-' +
            zeroPad(today.getDate());

        // expect
        assert.equal(xEval('today()').stringValue, today);
      });
    });
    /*

    describe('#if()', function() { it('should have tests', function() { TODO(); }); });

    describe('#boolean-from-string()', function() {
      _.forEach({
        '1': true,
        'true':true,
        'True':false,
        '0':false,
        '':false,
        'false':false,
        'nonsense':false
      }, function(expectedBoolean, nodeValue) {
        it('should evaluate `' + nodeValue +
            '` as ' + expectedBoolean.toString().toUpperCase(), function() {
          // given
          simpleValueIs(nodeValue);

          // then
          assert.equal(xEval('boolean-from-string(/simple/xpath/to/node)').stringValue,
              expectedBoolean.toString());
        });
      });
    });

    describe('#checklist()', function() { it('should have tests', function() { TODO(); }); });

    describe('#selected()', function() {
      it('should return true if requested item is in list', function() {
        // given
        simpleValueIs('one two three');

        // expect
        assert.ok(xEval('selected(/simple/xpath/to/node, "one")').booleanValue);
        assert.ok(xEval('selected(/simple/xpath/to/node, "two")').booleanValue);
        assert.ok(xEval('selected(/simple/xpath/to/node, "three")').booleanValue);
      });
      it('should return false if requested item not in list', function() {
        // given
        simpleValueIs('one two three');

        // expect
        assert.notOk(xEval('selected(/simple/xpath/to/node, "on")').booleanValue);
        assert.notOk(xEval('selected(/simple/xpath/to/node, "ne")').booleanValue);
        assert.notOk(xEval('selected(/simple/xpath/to/node, "four")').booleanValue);
      });
    });

    describe('#selected-at()', function() { it('should have tests', function() { TODO(); }); });
    describe('#round()', function() { it('should have tests', function() { TODO(); }); });
    describe('#area()', function() { it('should have tests', function() { TODO(); }); });
    describe('#position()', function() { it('should have tests', function() { TODO(); }); });
  });
  */

  describe('infix operators', function() {
    describe('math operators', function() {
      describe('with numbers', function() {
        _.forEach({
          '1 + 1' : 2,
          '1 - 1' : 0,
          '1 * 1' : 1,
          '1 div 1' : 1,
          '1 mod 1' : 0,
          '2 + 1' : 3,
          '2 - 1' : 1,
          '2 * 1' : 2,
          '2 div 1' : 2,
          '2 mod 1' : 0,
          '1 + 2' : 3,
          '1 - 2' : -1,
          '1 * 2' : 2,
          '1 div 2' : 0.5,
          '1 mod 2' : 1,
        }, function(expected, expr) {
          it('should evaluate "' + expr + '" as ' + expected, function() {
            assert.equal(xEval(expr).stringValue, expected);
          });
        });
      });
    });
    /*
    describe('boolean operators', function() {
      describe('with numbers', function() {
        _.forEach({
          '1 = 1' : true,
          '1 != 1' : false,
          '1 = 2' : false,
          '1 != 2' : true,
          '1 < 2' : true,
          '1 > 2' : false,
          '2 < 1' : false,
          '2 > 1' : true,
          '1 <= 2' : true,
          '1 >= 2' : false,
          '2 <= 1' : false,
          '2 >= 1' : true,
          '1 <= 1' : true,
          '1 >= 1' : true,
          '1 &lt; 2' : true,
          '1 &gt; 2' : false,
          '2 &lt; 1' : false,
          '2 &gt; 1' : true,
          '1 &lt;= 2' : true,
          '1 &gt;= 2' : false,
          '2 &lt;= 1' : false,
          '2 &gt;= 1' : true,
          '1 &lt;= 1' : true,
          '1 &gt;= 1' : true,
        }, function(expectedBoolean, expr) {
          it('should evaluate "' + expr + '" as ' + expectedBoolean.toString().toUpperCase(), function() {
            assert.equal(xEval(expr).booleanValue, expectedBoolean);
          });
        });
      });
      describe('with strings', function() {
        _.forEach({
          '"1" = "1"' : true,
          '"1" = "2"' : false,
          '"1" != "1"' : false,
          '"1" != "2"' : true,
          '"1" < "2"' : true,
          '"1" > "2"' : false,
          '"2" < "1"' : false,
          '"2" > "1"' : true,
          '"1" <= "2"' : true,
          '"1" >= "2"' : false,
          '"2" <= "1"' : false,
          '"2" >= "1"' : true,
          '"1" <= "1"' : true,
          '"1" >= "1"' : true,
          '"1" &lt; "2"' : true,
          '"1" &gt; "2"' : false,
          '"2" &lt; "1"' : false,
          '"2" &gt; "1"' : true,
          '"1" &lt;= "2"' : true,
          '"1" &gt;= "2"' : false,
          '"2" &lt;= "1"' : false,
          '"2" &gt;= "1"' : true,
          '"1" &lt;= "1"' : true,
          '"1" &gt;= "1"' : true,
          '"aardvark" < "aligator"' : true,
          '"aardvark" <= "aligator"' : true,
          '"aligator" < "aardvark"' : false,
          '"aligator" <= "aardvark"' : false,
          '"possum" > "aligator"' : true,
          '"possum" >= "aligator"' : true,
          '"aligator" > "possum"' : false,
          '"aligator" >= "possum"' : false,
        }, function(expectedBoolean, expr) {
          it('should evaluate "' + expr + '" as ' + expectedBoolean.toString().toUpperCase(), function() {
            assert.equal(xEval(expr).booleanValue, expectedBoolean);
          });
        });
      });
    });
  });

  describe('some complex examples', function() {
    _.forEach({
      'concat("uuid:", uuid())':/uuid:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/,
      '"2015-07-15" &lt; today()': /true/,
      '"2015-07-15" < today()' : /true/,
      "'2015-07-15' &lt; today()" : /true/,
      "'2015-07-15' < today()" : /true/,
      "'raw-string'" : /raw-string/,
      'format-date-time(date-time(decimal-date-time("2003-03-12") + 280), "%b %e, %Y")': /Dec 17, 2003/,
    }, function(matcher, expression) {
      it('should convert "' + expression + '" to match "' + matcher + '"', function() {
        var evaluated = xEval(expression);
        assert.match(evaluated.stringValue, matcher);
      });
    });
    */
  });
});
