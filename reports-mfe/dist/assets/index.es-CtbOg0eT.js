import { importShared } from './__federation_fn_import-BFo6b6m_.js';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


var __assign = function() {
  __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
  };
  return __assign.apply(this, arguments);
};

function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
      }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var MS = '-ms-';
var MOZ = '-moz-';
var WEBKIT = '-webkit-';

var COMMENT = 'comm';
var RULESET = 'rule';
var DECLARATION = 'decl';
var IMPORT = '@import';
var KEYFRAMES = '@keyframes';
var LAYER = '@layer';

/**
 * @param {number}
 * @return {number}
 */
var abs = Math.abs;

/**
 * @param {number}
 * @return {string}
 */
var from = String.fromCharCode;

/**
 * @param {object}
 * @return {object}
 */
var assign = Object.assign;

/**
 * @param {string} value
 * @param {number} length
 * @return {number}
 */
function hash (value, length) {
	return charat(value, 0) ^ 45 ? (((((((length << 2) ^ charat(value, 0)) << 2) ^ charat(value, 1)) << 2) ^ charat(value, 2)) << 2) ^ charat(value, 3) : 0
}

/**
 * @param {string} value
 * @return {string}
 */
function trim (value) {
	return value.trim()
}

/**
 * @param {string} value
 * @param {RegExp} pattern
 * @return {string?}
 */
function match (value, pattern) {
	return (value = pattern.exec(value)) ? value[0] : value
}

/**
 * @param {string} value
 * @param {(string|RegExp)} pattern
 * @param {string} replacement
 * @return {string}
 */
function replace (value, pattern, replacement) {
	return value.replace(pattern, replacement)
}

/**
 * @param {string} value
 * @param {string} search
 * @param {number} position
 * @return {number}
 */
function indexof (value, search, position) {
	return value.indexOf(search, position)
}

/**
 * @param {string} value
 * @param {number} index
 * @return {number}
 */
function charat (value, index) {
	return value.charCodeAt(index) | 0
}

/**
 * @param {string} value
 * @param {number} begin
 * @param {number} end
 * @return {string}
 */
function substr (value, begin, end) {
	return value.slice(begin, end)
}

/**
 * @param {string} value
 * @return {number}
 */
function strlen (value) {
	return value.length
}

/**
 * @param {any[]} value
 * @return {number}
 */
function sizeof (value) {
	return value.length
}

/**
 * @param {any} value
 * @param {any[]} array
 * @return {any}
 */
function append (value, array) {
	return array.push(value), value
}

/**
 * @param {string[]} array
 * @param {function} callback
 * @return {string}
 */
function combine (array, callback) {
	return array.map(callback).join('')
}

/**
 * @param {string[]} array
 * @param {RegExp} pattern
 * @return {string[]}
 */
function filter (array, pattern) {
	return array.filter(function (value) { return !match(value, pattern) })
}

var line = 1;
var column = 1;
var length = 0;
var position = 0;
var character = 0;
var characters = '';

/**
 * @param {string} value
 * @param {object | null} root
 * @param {object | null} parent
 * @param {string} type
 * @param {string[] | string} props
 * @param {object[] | string} children
 * @param {object[]} siblings
 * @param {number} length
 */
function node (value, root, parent, type, props, children, length, siblings) {
	return {value: value, root: root, parent: parent, type: type, props: props, children: children, line: line, column: column, length: length, return: '', siblings: siblings}
}

/**
 * @param {object} root
 * @param {object} props
 * @return {object}
 */
function copy (root, props) {
	return assign(node('', null, null, '', null, null, 0, root.siblings), root, {length: -root.length}, props)
}

/**
 * @param {object} root
 */
function lift (root) {
	while (root.root)
		root = copy(root.root, {children: [root]});

	append(root, root.siblings);
}

/**
 * @return {number}
 */
function char () {
	return character
}

/**
 * @return {number}
 */
function prev () {
	character = position > 0 ? charat(characters, --position) : 0;

	if (column--, character === 10)
		column = 1, line--;

	return character
}

/**
 * @return {number}
 */
function next () {
	character = position < length ? charat(characters, position++) : 0;

	if (column++, character === 10)
		column = 1, line++;

	return character
}

/**
 * @return {number}
 */
function peek () {
	return charat(characters, position)
}

/**
 * @return {number}
 */
function caret () {
	return position
}

/**
 * @param {number} begin
 * @param {number} end
 * @return {string}
 */
function slice (begin, end) {
	return substr(characters, begin, end)
}

/**
 * @param {number} type
 * @return {number}
 */
function token (type) {
	switch (type) {
		// \0 \t \n \r \s whitespace token
		case 0: case 9: case 10: case 13: case 32:
			return 5
		// ! + , / > @ ~ isolate token
		case 33: case 43: case 44: case 47: case 62: case 64: case 126:
		// ; { } breakpoint token
		case 59: case 123: case 125:
			return 4
		// : accompanied token
		case 58:
			return 3
		// " ' ( [ opening delimit token
		case 34: case 39: case 40: case 91:
			return 2
		// ) ] closing delimit token
		case 41: case 93:
			return 1
	}

	return 0
}

/**
 * @param {string} value
 * @return {any[]}
 */
function alloc (value) {
	return line = column = 1, length = strlen(characters = value), position = 0, []
}

/**
 * @param {any} value
 * @return {any}
 */
function dealloc (value) {
	return characters = '', value
}

/**
 * @param {number} type
 * @return {string}
 */
function delimit (type) {
	return trim(slice(position - 1, delimiter(type === 91 ? type + 2 : type === 40 ? type + 1 : type)))
}

/**
 * @param {number} type
 * @return {string}
 */
function whitespace (type) {
	while (character = peek())
		if (character < 33)
			next();
		else
			break

	return token(type) > 2 || token(character) > 3 ? '' : ' '
}

/**
 * @param {number} index
 * @param {number} count
 * @return {string}
 */
function escaping (index, count) {
	while (--count && next())
		// not 0-9 A-F a-f
		if (character < 48 || character > 102 || (character > 57 && character < 65) || (character > 70 && character < 97))
			break

	return slice(index, caret() + (count < 6 && peek() == 32 && next() == 32))
}

/**
 * @param {number} type
 * @return {number}
 */
function delimiter (type) {
	while (next())
		switch (character) {
			// ] ) " '
			case type:
				return position
			// " '
			case 34: case 39:
				if (type !== 34 && type !== 39)
					delimiter(character);
				break
			// (
			case 40:
				if (type === 41)
					delimiter(type);
				break
			// \
			case 92:
				next();
				break
		}

	return position
}

/**
 * @param {number} type
 * @param {number} index
 * @return {number}
 */
function commenter (type, index) {
	while (next())
		// //
		if (type + character === 47 + 10)
			break
		// /*
		else if (type + character === 42 + 42 && peek() === 47)
			break

	return '/*' + slice(index, position - 1) + '*' + from(type === 47 ? type : next())
}

/**
 * @param {number} index
 * @return {string}
 */
function identifier (index) {
	while (!token(peek()))
		next();

	return slice(index, position)
}

/**
 * @param {string} value
 * @return {object[]}
 */
function compile (value) {
	return dealloc(parse('', null, null, null, [''], value = alloc(value), 0, [0], value))
}

/**
 * @param {string} value
 * @param {object} root
 * @param {object?} parent
 * @param {string[]} rule
 * @param {string[]} rules
 * @param {string[]} rulesets
 * @param {number[]} pseudo
 * @param {number[]} points
 * @param {string[]} declarations
 * @return {object}
 */
function parse (value, root, parent, rule, rules, rulesets, pseudo, points, declarations) {
	var index = 0;
	var offset = 0;
	var length = pseudo;
	var atrule = 0;
	var property = 0;
	var previous = 0;
	var variable = 1;
	var scanning = 1;
	var ampersand = 1;
	var character = 0;
	var type = '';
	var props = rules;
	var children = rulesets;
	var reference = rule;
	var characters = type;

	while (scanning)
		switch (previous = character, character = next()) {
			// (
			case 40:
				if (previous != 108 && charat(characters, length - 1) == 58) {
					if (indexof(characters += replace(delimit(character), '&', '&\f'), '&\f', abs(index ? points[index - 1] : 0)) != -1)
						ampersand = -1;
					break
				}
			// " ' [
			case 34: case 39: case 91:
				characters += delimit(character);
				break
			// \t \n \r \s
			case 9: case 10: case 13: case 32:
				characters += whitespace(previous);
				break
			// \
			case 92:
				characters += escaping(caret() - 1, 7);
				continue
			// /
			case 47:
				switch (peek()) {
					case 42: case 47:
						append(comment(commenter(next(), caret()), root, parent, declarations), declarations);
						break
					default:
						characters += '/';
				}
				break
			// {
			case 123 * variable:
				points[index++] = strlen(characters) * ampersand;
			// } ; \0
			case 125 * variable: case 59: case 0:
				switch (character) {
					// \0 }
					case 0: case 125: scanning = 0;
					// ;
					case 59 + offset: if (ampersand == -1) characters = replace(characters, /\f/g, '');
						if (property > 0 && (strlen(characters) - length))
							append(property > 32 ? declaration(characters + ';', rule, parent, length - 1, declarations) : declaration(replace(characters, ' ', '') + ';', rule, parent, length - 2, declarations), declarations);
						break
					// @ ;
					case 59: characters += ';';
					// { rule/at-rule
					default:
						append(reference = ruleset(characters, root, parent, index, offset, rules, points, type, props = [], children = [], length, rulesets), rulesets);

						if (character === 123)
							if (offset === 0)
								parse(characters, root, reference, reference, props, rulesets, length, points, children);
							else
								switch (atrule === 99 && charat(characters, 3) === 110 ? 100 : atrule) {
									// d l m s
									case 100: case 108: case 109: case 115:
										parse(value, reference, reference, rule && append(ruleset(value, reference, reference, 0, 0, rules, points, type, rules, props = [], length, children), children), rules, children, length, points, rule ? props : children);
										break
									default:
										parse(characters, reference, reference, reference, [''], children, 0, points, children);
								}
				}

				index = offset = property = 0, variable = ampersand = 1, type = characters = '', length = pseudo;
				break
			// :
			case 58:
				length = 1 + strlen(characters), property = previous;
			default:
				if (variable < 1)
					if (character == 123)
						--variable;
					else if (character == 125 && variable++ == 0 && prev() == 125)
						continue

				switch (characters += from(character), character * variable) {
					// &
					case 38:
						ampersand = offset > 0 ? 1 : (characters += '\f', -1);
						break
					// ,
					case 44:
						points[index++] = (strlen(characters) - 1) * ampersand, ampersand = 1;
						break
					// @
					case 64:
						// -
						if (peek() === 45)
							characters += delimit(next());

						atrule = peek(), offset = length = strlen(type = characters += identifier(caret())), character++;
						break
					// -
					case 45:
						if (previous === 45 && strlen(characters) == 2)
							variable = 0;
				}
		}

	return rulesets
}

/**
 * @param {string} value
 * @param {object} root
 * @param {object?} parent
 * @param {number} index
 * @param {number} offset
 * @param {string[]} rules
 * @param {number[]} points
 * @param {string} type
 * @param {string[]} props
 * @param {string[]} children
 * @param {number} length
 * @param {object[]} siblings
 * @return {object}
 */
function ruleset (value, root, parent, index, offset, rules, points, type, props, children, length, siblings) {
	var post = offset - 1;
	var rule = offset === 0 ? rules : [''];
	var size = sizeof(rule);

	for (var i = 0, j = 0, k = 0; i < index; ++i)
		for (var x = 0, y = substr(value, post + 1, post = abs(j = points[i])), z = value; x < size; ++x)
			if (z = trim(j > 0 ? rule[x] + ' ' + y : replace(y, /&\f/g, rule[x])))
				props[k++] = z;

	return node(value, root, parent, offset === 0 ? RULESET : type, props, children, length, siblings)
}

/**
 * @param {number} value
 * @param {object} root
 * @param {object?} parent
 * @param {object[]} siblings
 * @return {object}
 */
function comment (value, root, parent, siblings) {
	return node(value, root, parent, COMMENT, from(char()), substr(value, 2, -2), 0, siblings)
}

/**
 * @param {string} value
 * @param {object} root
 * @param {object?} parent
 * @param {number} length
 * @param {object[]} siblings
 * @return {object}
 */
function declaration (value, root, parent, length, siblings) {
	return node(value, root, parent, DECLARATION, substr(value, 0, length), substr(value, length + 1, -1), length, siblings)
}

/**
 * @param {string} value
 * @param {number} length
 * @param {object[]} children
 * @return {string}
 */
function prefix (value, length, children) {
	switch (hash(value, length)) {
		// color-adjust
		case 5103:
			return WEBKIT + 'print-' + value + value
		// animation, animation-(delay|direction|duration|fill-mode|iteration-count|name|play-state|timing-function)
		case 5737: case 4201: case 3177: case 3433: case 1641: case 4457: case 2921:
		// text-decoration, filter, clip-path, backface-visibility, column, box-decoration-break
		case 5572: case 6356: case 5844: case 3191: case 6645: case 3005:
		// mask, mask-image, mask-(mode|clip|size), mask-(repeat|origin), mask-position, mask-composite,
		case 6391: case 5879: case 5623: case 6135: case 4599: case 4855:
		// background-clip, columns, column-(count|fill|gap|rule|rule-color|rule-style|rule-width|span|width)
		case 4215: case 6389: case 5109: case 5365: case 5621: case 3829:
			return WEBKIT + value + value
		// tab-size
		case 4789:
			return MOZ + value + value
		// appearance, user-select, transform, hyphens, text-size-adjust
		case 5349: case 4246: case 4810: case 6968: case 2756:
			return WEBKIT + value + MOZ + value + MS + value + value
		// writing-mode
		case 5936:
			switch (charat(value, length + 11)) {
				// vertical-l(r)
				case 114:
					return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, 'tb') + value
				// vertical-r(l)
				case 108:
					return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, 'tb-rl') + value
				// horizontal(-)tb
				case 45:
					return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, 'lr') + value
				// default: fallthrough to below
			}
		// flex, flex-direction, scroll-snap-type, writing-mode
		case 6828: case 4268: case 2903:
			return WEBKIT + value + MS + value + value
		// order
		case 6165:
			return WEBKIT + value + MS + 'flex-' + value + value
		// align-items
		case 5187:
			return WEBKIT + value + replace(value, /(\w+).+(:[^]+)/, WEBKIT + 'box-$1$2' + MS + 'flex-$1$2') + value
		// align-self
		case 5443:
			return WEBKIT + value + MS + 'flex-item-' + replace(value, /flex-|-self/g, '') + (!match(value, /flex-|baseline/) ? MS + 'grid-row-' + replace(value, /flex-|-self/g, '') : '') + value
		// align-content
		case 4675:
			return WEBKIT + value + MS + 'flex-line-pack' + replace(value, /align-content|flex-|-self/g, '') + value
		// flex-shrink
		case 5548:
			return WEBKIT + value + MS + replace(value, 'shrink', 'negative') + value
		// flex-basis
		case 5292:
			return WEBKIT + value + MS + replace(value, 'basis', 'preferred-size') + value
		// flex-grow
		case 6060:
			return WEBKIT + 'box-' + replace(value, '-grow', '') + WEBKIT + value + MS + replace(value, 'grow', 'positive') + value
		// transition
		case 4554:
			return WEBKIT + replace(value, /([^-])(transform)/g, '$1' + WEBKIT + '$2') + value
		// cursor
		case 6187:
			return replace(replace(replace(value, /(zoom-|grab)/, WEBKIT + '$1'), /(image-set)/, WEBKIT + '$1'), value, '') + value
		// background, background-image
		case 5495: case 3959:
			return replace(value, /(image-set\([^]*)/, WEBKIT + '$1' + '$`$1')
		// justify-content
		case 4968:
			return replace(replace(value, /(.+:)(flex-)?(.*)/, WEBKIT + 'box-pack:$3' + MS + 'flex-pack:$3'), /s.+-b[^;]+/, 'justify') + WEBKIT + value + value
		// justify-self
		case 4200:
			if (!match(value, /flex-|baseline/)) return MS + 'grid-column-align' + substr(value, length) + value
			break
		// grid-template-(columns|rows)
		case 2592: case 3360:
			return MS + replace(value, 'template-', '') + value
		// grid-(row|column)-start
		case 4384: case 3616:
			if (children && children.some(function (element, index) { return length = index, match(element.props, /grid-\w+-end/) })) {
				return ~indexof(value + (children = children[length].value), 'span', 0) ? value : (MS + replace(value, '-start', '') + value + MS + 'grid-row-span:' + (~indexof(children, 'span', 0) ? match(children, /\d+/) : +match(children, /\d+/) - +match(value, /\d+/)) + ';')
			}
			return MS + replace(value, '-start', '') + value
		// grid-(row|column)-end
		case 4896: case 4128:
			return (children && children.some(function (element) { return match(element.props, /grid-\w+-start/) })) ? value : MS + replace(replace(value, '-end', '-span'), 'span ', '') + value
		// (margin|padding)-inline-(start|end)
		case 4095: case 3583: case 4068: case 2532:
			return replace(value, /(.+)-inline(.+)/, WEBKIT + '$1$2') + value
		// (min|max)?(width|height|inline-size|block-size)
		case 8116: case 7059: case 5753: case 5535:
		case 5445: case 5701: case 4933: case 4677:
		case 5533: case 5789: case 5021: case 4765:
			// stretch, max-content, min-content, fill-available
			if (strlen(value) - 1 - length > 6)
				switch (charat(value, length + 1)) {
					// (m)ax-content, (m)in-content
					case 109:
						// -
						if (charat(value, length + 4) !== 45)
							break
					// (f)ill-available, (f)it-content
					case 102:
						return replace(value, /(.+:)(.+)-([^]+)/, '$1' + WEBKIT + '$2-$3' + '$1' + MOZ + (charat(value, length + 3) == 108 ? '$3' : '$2-$3')) + value
					// (s)tretch
					case 115:
						return ~indexof(value, 'stretch', 0) ? prefix(replace(value, 'stretch', 'fill-available'), length, children) + value : value
				}
			break
		// grid-(column|row)
		case 5152: case 5920:
			return replace(value, /(.+?):(\d+)(\s*\/\s*(span)?\s*(\d+))?(.*)/, function (_, a, b, c, d, e, f) { return (MS + a + ':' + b + f) + (c ? (MS + a + '-span:' + (d ? e : +e - +b)) + f : '') + value })
		// position: sticky
		case 4949:
			// stick(y)?
			if (charat(value, length + 6) === 121)
				return replace(value, ':', ':' + WEBKIT) + value
			break
		// display: (flex|inline-flex|grid|inline-grid)
		case 6444:
			switch (charat(value, charat(value, 14) === 45 ? 18 : 11)) {
				// (inline-)?fle(x)
				case 120:
					return replace(value, /(.+:)([^;\s!]+)(;|(\s+)?!.+)?/, '$1' + WEBKIT + (charat(value, 14) === 45 ? 'inline-' : '') + 'box$3' + '$1' + WEBKIT + '$2$3' + '$1' + MS + '$2box$3') + value
				// (inline-)?gri(d)
				case 100:
					return replace(value, ':', ':' + MS) + value
			}
			break
		// scroll-margin, scroll-margin-(top|right|bottom|left)
		case 5719: case 2647: case 2135: case 3927: case 2391:
			return replace(value, 'scroll-', 'scroll-snap-') + value
	}

	return value
}

/**
 * @param {object[]} children
 * @param {function} callback
 * @return {string}
 */
function serialize (children, callback) {
	var output = '';

	for (var i = 0; i < children.length; i++)
		output += callback(children[i], i, children, callback) || '';

	return output
}

/**
 * @param {object} element
 * @param {number} index
 * @param {object[]} children
 * @param {function} callback
 * @return {string}
 */
function stringify (element, index, children, callback) {
	switch (element.type) {
		case LAYER: if (element.children.length) break
		case IMPORT: case DECLARATION: return element.return = element.return || element.value
		case COMMENT: return ''
		case KEYFRAMES: return element.return = element.value + '{' + serialize(element.children, callback) + '}'
		case RULESET: if (!strlen(element.value = element.props.join(','))) return ''
	}

	return strlen(children = serialize(element.children, callback)) ? element.return = element.value + '{' + children + '}' : ''
}

/**
 * @param {function[]} collection
 * @return {function}
 */
function middleware (collection) {
	var length = sizeof(collection);

	return function (element, index, children, callback) {
		var output = '';

		for (var i = 0; i < length; i++)
			output += collection[i](element, index, children, callback) || '';

		return output
	}
}

/**
 * @param {function} callback
 * @return {function}
 */
function rulesheet (callback) {
	return function (element) {
		if (!element.root)
			if (element = element.return)
				callback(element);
	}
}

/**
 * @param {object} element
 * @param {number} index
 * @param {object[]} children
 * @param {function} callback
 */
function prefixer (element, index, children, callback) {
	if (element.length > -1)
		if (!element.return)
			switch (element.type) {
				case DECLARATION: element.return = prefix(element.value, element.length, children);
					return
				case KEYFRAMES:
					return serialize([copy(element, {value: replace(element.value, '@', '@' + WEBKIT)})], callback)
				case RULESET:
					if (element.length)
						return combine(children = element.props, function (value) {
							switch (match(value, callback = /(::plac\w+|:read-\w+)/)) {
								// :read-(only|write)
								case ':read-only': case ':read-write':
									lift(copy(element, {props: [replace(value, /:(read-\w+)/, ':' + MOZ + '$1')]}));
									lift(copy(element, {props: [value]}));
									assign(element, {props: filter(children, callback)});
									break
								// :placeholder
								case '::placeholder':
									lift(copy(element, {props: [replace(value, /:(plac\w+)/, ':' + WEBKIT + 'input-$1')]}));
									lift(copy(element, {props: [replace(value, /:(plac\w+)/, ':' + MOZ + '$1')]}));
									lift(copy(element, {props: [replace(value, /:(plac\w+)/, MS + 'input-$1')]}));
									lift(copy(element, {props: [value]}));
									assign(element, {props: filter(children, callback)});
									break
							}

							return ''
						})
			}
}

var unitlessKeys = {
  animationIterationCount: 1,
  aspectRatio: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  msGridRow: 1,
  msGridRowSpan: 1,
  msGridColumn: 1,
  msGridColumnSpan: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,
  // SVG-related properties
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1
};

var define_process_env_default = {};
const o = await importShared('react');
const {useRef:r$1,useState:s$1,useMemo:i$1,useEffect:a,useContext:c$1,useDebugValue:l$1,createElement:u$1} = o;
var f$1 = "undefined" != typeof process && void 0 !== define_process_env_default && (define_process_env_default.REACT_APP_SC_ATTR || define_process_env_default.SC_ATTR) || "data-styled", m$1 = "active", y$1 = "data-styled-version", v$1 = "6.1.19", g$1 = "/*!sc*/\n", S$1 = "undefined" != typeof window && "undefined" != typeof document, w$1 = Boolean("boolean" == typeof SC_DISABLE_SPEEDY ? SC_DISABLE_SPEEDY : "undefined" != typeof process && void 0 !== define_process_env_default && void 0 !== define_process_env_default.REACT_APP_SC_DISABLE_SPEEDY && "" !== define_process_env_default.REACT_APP_SC_DISABLE_SPEEDY ? "false" !== define_process_env_default.REACT_APP_SC_DISABLE_SPEEDY && define_process_env_default.REACT_APP_SC_DISABLE_SPEEDY : "undefined" != typeof process && void 0 !== define_process_env_default && void 0 !== define_process_env_default.SC_DISABLE_SPEEDY && "" !== define_process_env_default.SC_DISABLE_SPEEDY ? "false" !== define_process_env_default.SC_DISABLE_SPEEDY && define_process_env_default.SC_DISABLE_SPEEDY : false), _$1 = Object.freeze([]), C$1 = Object.freeze({});
function I$1(e2, t2, n2) {
  return void 0 === n2 && (n2 = C$1), e2.theme !== n2.theme && e2.theme || t2 || n2.theme;
}
var A$1 = /* @__PURE__ */ new Set(["a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "u", "ul", "use", "var", "video", "wbr", "circle", "clipPath", "defs", "ellipse", "foreignObject", "g", "image", "line", "linearGradient", "marker", "mask", "path", "pattern", "polygon", "polyline", "radialGradient", "rect", "stop", "svg", "text", "tspan"]), O$1 = /[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~-]+/g, D$1 = /(^-|-$)/g;
function R$1(e2) {
  return e2.replace(O$1, "-").replace(D$1, "");
}
var T$1 = /(a)(d)/gi, k$1 = 52, j$1 = function(e2) {
  return String.fromCharCode(e2 + (e2 > 25 ? 39 : 97));
};
function x$1(e2) {
  var t2, n2 = "";
  for (t2 = Math.abs(e2); t2 > k$1; t2 = t2 / k$1 | 0) n2 = j$1(t2 % k$1) + n2;
  return (j$1(t2 % k$1) + n2).replace(T$1, "$1-$2");
}
var V$1, F$1 = 5381, M$1 = function(e2, t2) {
  for (var n2 = t2.length; n2; ) e2 = 33 * e2 ^ t2.charCodeAt(--n2);
  return e2;
}, z$1 = function(e2) {
  return M$1(F$1, e2);
};
function $$1(e2) {
  return x$1(z$1(e2) >>> 0);
}
function B$1(e2) {
  return e2.displayName || e2.name || "Component";
}
function L$1(e2) {
  return "string" == typeof e2 && true;
}
var G$1 = "function" == typeof Symbol && Symbol.for, Y$1 = G$1 ? /* @__PURE__ */ Symbol.for("react.memo") : 60115, W$1 = G$1 ? /* @__PURE__ */ Symbol.for("react.forward_ref") : 60112, q$1 = { childContextTypes: true, contextType: true, contextTypes: true, defaultProps: true, displayName: true, getDefaultProps: true, getDerivedStateFromError: true, getDerivedStateFromProps: true, mixins: true, propTypes: true, type: true }, H$1 = { name: true, length: true, prototype: true, caller: true, callee: true, arguments: true, arity: true }, U$1 = { $$typeof: true, compare: true, defaultProps: true, displayName: true, propTypes: true, type: true }, J$1 = ((V$1 = {})[W$1] = { $$typeof: true, render: true, defaultProps: true, displayName: true, propTypes: true }, V$1[Y$1] = U$1, V$1);
function X$1(e2) {
  return ("type" in (t2 = e2) && t2.type.$$typeof) === Y$1 ? U$1 : "$$typeof" in e2 ? J$1[e2.$$typeof] : q$1;
  var t2;
}
var Z$1 = Object.defineProperty, K$1 = Object.getOwnPropertyNames, Q$1 = Object.getOwnPropertySymbols, ee$1 = Object.getOwnPropertyDescriptor, te$1 = Object.getPrototypeOf, ne$1 = Object.prototype;
function oe$1(e2, t2, n2) {
  if ("string" != typeof t2) {
    if (ne$1) {
      var o2 = te$1(t2);
      o2 && o2 !== ne$1 && oe$1(e2, o2, n2);
    }
    var r2 = K$1(t2);
    Q$1 && (r2 = r2.concat(Q$1(t2)));
    for (var s2 = X$1(e2), i2 = X$1(t2), a2 = 0; a2 < r2.length; ++a2) {
      var c2 = r2[a2];
      if (!(c2 in H$1 || n2 && n2[c2] || i2 && c2 in i2 || s2 && c2 in s2)) {
        var l2 = ee$1(t2, c2);
        try {
          Z$1(e2, c2, l2);
        } catch (e3) {
        }
      }
    }
  }
  return e2;
}
function re$1(e2) {
  return "function" == typeof e2;
}
function se$1(e2) {
  return "object" == typeof e2 && "styledComponentId" in e2;
}
function ie$1(e2, t2) {
  return e2 && t2 ? "".concat(e2, " ").concat(t2) : e2 || t2 || "";
}
function ae$1(e2, t2) {
  if (0 === e2.length) return "";
  for (var n2 = e2[0], o2 = 1; o2 < e2.length; o2++) n2 += e2[o2];
  return n2;
}
function ce$1(e2) {
  return null !== e2 && "object" == typeof e2 && e2.constructor.name === Object.name && !("props" in e2 && e2.$$typeof);
}
function le$1(e2, t2, n2) {
  if (void 0 === n2 && (n2 = false), !n2 && !ce$1(e2) && !Array.isArray(e2)) return t2;
  if (Array.isArray(t2)) for (var o2 = 0; o2 < t2.length; o2++) e2[o2] = le$1(e2[o2], t2[o2]);
  else if (ce$1(t2)) for (var o2 in t2) e2[o2] = le$1(e2[o2], t2[o2]);
  return e2;
}
function ue$1(e2, t2) {
  Object.defineProperty(e2, "toString", { value: t2 });
}
function he$1(t2) {
  for (var n2 = [], o2 = 1; o2 < arguments.length; o2++) n2[o2 - 1] = arguments[o2];
  return new Error("An error occurred. See https://github.com/styled-components/styled-components/blob/main/packages/styled-components/src/utils/errors.md#".concat(t2, " for more information.").concat(n2.length > 0 ? " Args: ".concat(n2.join(", ")) : "")) ;
}
var fe$1 = (function() {
  function e2(e3) {
    this.groupSizes = new Uint32Array(512), this.length = 512, this.tag = e3;
  }
  return e2.prototype.indexOfGroup = function(e3) {
    for (var t2 = 0, n2 = 0; n2 < e3; n2++) t2 += this.groupSizes[n2];
    return t2;
  }, e2.prototype.insertRules = function(e3, t2) {
    if (e3 >= this.groupSizes.length) {
      for (var n2 = this.groupSizes, o2 = n2.length, r2 = o2; e3 >= r2; ) if ((r2 <<= 1) < 0) throw he$1(16, "".concat(e3));
      this.groupSizes = new Uint32Array(r2), this.groupSizes.set(n2), this.length = r2;
      for (var s2 = o2; s2 < r2; s2++) this.groupSizes[s2] = 0;
    }
    for (var i2 = this.indexOfGroup(e3 + 1), a2 = (s2 = 0, t2.length); s2 < a2; s2++) this.tag.insertRule(i2, t2[s2]) && (this.groupSizes[e3]++, i2++);
  }, e2.prototype.clearGroup = function(e3) {
    if (e3 < this.length) {
      var t2 = this.groupSizes[e3], n2 = this.indexOfGroup(e3), o2 = n2 + t2;
      this.groupSizes[e3] = 0;
      for (var r2 = n2; r2 < o2; r2++) this.tag.deleteRule(n2);
    }
  }, e2.prototype.getGroup = function(e3) {
    var t2 = "";
    if (e3 >= this.length || 0 === this.groupSizes[e3]) return t2;
    for (var n2 = this.groupSizes[e3], o2 = this.indexOfGroup(e3), r2 = o2 + n2, s2 = o2; s2 < r2; s2++) t2 += "".concat(this.tag.getRule(s2)).concat(g$1);
    return t2;
  }, e2;
})(), ye$1 = /* @__PURE__ */ new Map(), ve$1 = /* @__PURE__ */ new Map(), ge$1 = 1, Se$1 = function(e2) {
  if (ye$1.has(e2)) return ye$1.get(e2);
  for (; ve$1.has(ge$1); ) ge$1++;
  var t2 = ge$1++;
  return ye$1.set(e2, t2), ve$1.set(t2, e2), t2;
}, we$1 = function(e2, t2) {
  ge$1 = t2 + 1, ye$1.set(e2, t2), ve$1.set(t2, e2);
}, be$1 = "style[".concat(f$1, "][").concat(y$1, '="').concat(v$1, '"]'), Ee$1 = new RegExp("^".concat(f$1, '\\.g(\\d+)\\[id="([\\w\\d-]+)"\\].*?"([^"]*)')), Ne$1 = function(e2, t2, n2) {
  for (var o2, r2 = n2.split(","), s2 = 0, i2 = r2.length; s2 < i2; s2++) (o2 = r2[s2]) && e2.registerName(t2, o2);
}, Pe$1 = function(e2, t2) {
  for (var n2, o2 = (null !== (n2 = t2.textContent) && void 0 !== n2 ? n2 : "").split(g$1), r2 = [], s2 = 0, i2 = o2.length; s2 < i2; s2++) {
    var a2 = o2[s2].trim();
    if (a2) {
      var c2 = a2.match(Ee$1);
      if (c2) {
        var l2 = 0 | parseInt(c2[1], 10), u2 = c2[2];
        0 !== l2 && (we$1(u2, l2), Ne$1(e2, u2, c2[3]), e2.getTag().insertRules(l2, r2)), r2.length = 0;
      } else r2.push(a2);
    }
  }
}, _e$1 = function(e2) {
  for (var t2 = document.querySelectorAll(be$1), n2 = 0, o2 = t2.length; n2 < o2; n2++) {
    var r2 = t2[n2];
    r2 && r2.getAttribute(f$1) !== m$1 && (Pe$1(e2, r2), r2.parentNode && r2.parentNode.removeChild(r2));
  }
};
function Ce$1() {
  return "undefined" != typeof __webpack_nonce__ ? __webpack_nonce__ : null;
}
var Ie$1 = function(e2) {
  var t2 = document.head, n2 = e2 || t2, o2 = document.createElement("style"), r2 = (function(e3) {
    var t3 = Array.from(e3.querySelectorAll("style[".concat(f$1, "]")));
    return t3[t3.length - 1];
  })(n2), s2 = void 0 !== r2 ? r2.nextSibling : null;
  o2.setAttribute(f$1, m$1), o2.setAttribute(y$1, v$1);
  var i2 = Ce$1();
  return i2 && o2.setAttribute("nonce", i2), n2.insertBefore(o2, s2), o2;
}, Ae$1 = (function() {
  function e2(e3) {
    this.element = Ie$1(e3), this.element.appendChild(document.createTextNode("")), this.sheet = (function(e4) {
      if (e4.sheet) return e4.sheet;
      for (var t2 = document.styleSheets, n2 = 0, o2 = t2.length; n2 < o2; n2++) {
        var r2 = t2[n2];
        if (r2.ownerNode === e4) return r2;
      }
      throw he$1(17);
    })(this.element), this.length = 0;
  }
  return e2.prototype.insertRule = function(e3, t2) {
    try {
      return this.sheet.insertRule(t2, e3), this.length++, true;
    } catch (e4) {
      return false;
    }
  }, e2.prototype.deleteRule = function(e3) {
    this.sheet.deleteRule(e3), this.length--;
  }, e2.prototype.getRule = function(e3) {
    var t2 = this.sheet.cssRules[e3];
    return t2 && t2.cssText ? t2.cssText : "";
  }, e2;
})(), Oe$1 = (function() {
  function e2(e3) {
    this.element = Ie$1(e3), this.nodes = this.element.childNodes, this.length = 0;
  }
  return e2.prototype.insertRule = function(e3, t2) {
    if (e3 <= this.length && e3 >= 0) {
      var n2 = document.createTextNode(t2);
      return this.element.insertBefore(n2, this.nodes[e3] || null), this.length++, true;
    }
    return false;
  }, e2.prototype.deleteRule = function(e3) {
    this.element.removeChild(this.nodes[e3]), this.length--;
  }, e2.prototype.getRule = function(e3) {
    return e3 < this.length ? this.nodes[e3].textContent : "";
  }, e2;
})(), De$1 = (function() {
  function e2(e3) {
    this.rules = [], this.length = 0;
  }
  return e2.prototype.insertRule = function(e3, t2) {
    return e3 <= this.length && (this.rules.splice(e3, 0, t2), this.length++, true);
  }, e2.prototype.deleteRule = function(e3) {
    this.rules.splice(e3, 1), this.length--;
  }, e2.prototype.getRule = function(e3) {
    return e3 < this.length ? this.rules[e3] : "";
  }, e2;
})(), Re$1 = S$1, Te$1 = { isServer: !S$1, useCSSOMInjection: !w$1 }, ke$1 = (function() {
  function e2(e3, n2, o2) {
    void 0 === e3 && (e3 = C$1), void 0 === n2 && (n2 = {});
    var r2 = this;
    this.options = __assign(__assign({}, Te$1), e3), this.gs = n2, this.names = new Map(o2), this.server = !!e3.isServer, !this.server && S$1 && Re$1 && (Re$1 = false, _e$1(this)), ue$1(this, function() {
      return (function(e4) {
        for (var t2 = e4.getTag(), n3 = t2.length, o3 = "", r3 = function(n4) {
          var r4 = (function(e5) {
            return ve$1.get(e5);
          })(n4);
          if (void 0 === r4) return "continue";
          var s3 = e4.names.get(r4), i2 = t2.getGroup(n4);
          if (void 0 === s3 || !s3.size || 0 === i2.length) return "continue";
          var a2 = "".concat(f$1, ".g").concat(n4, '[id="').concat(r4, '"]'), c2 = "";
          void 0 !== s3 && s3.forEach(function(e5) {
            e5.length > 0 && (c2 += "".concat(e5, ","));
          }), o3 += "".concat(i2).concat(a2, '{content:"').concat(c2, '"}').concat(g$1);
        }, s2 = 0; s2 < n3; s2++) r3(s2);
        return o3;
      })(r2);
    });
  }
  return e2.registerId = function(e3) {
    return Se$1(e3);
  }, e2.prototype.rehydrate = function() {
    !this.server && S$1 && _e$1(this);
  }, e2.prototype.reconstructWithOptions = function(n2, o2) {
    return void 0 === o2 && (o2 = true), new e2(__assign(__assign({}, this.options), n2), this.gs, o2 && this.names || void 0);
  }, e2.prototype.allocateGSInstance = function(e3) {
    return this.gs[e3] = (this.gs[e3] || 0) + 1;
  }, e2.prototype.getTag = function() {
    return this.tag || (this.tag = (e3 = (function(e4) {
      var t2 = e4.useCSSOMInjection, n2 = e4.target;
      return e4.isServer ? new De$1(n2) : t2 ? new Ae$1(n2) : new Oe$1(n2);
    })(this.options), new fe$1(e3)));
    var e3;
  }, e2.prototype.hasNameForId = function(e3, t2) {
    return this.names.has(e3) && this.names.get(e3).has(t2);
  }, e2.prototype.registerName = function(e3, t2) {
    if (Se$1(e3), this.names.has(e3)) this.names.get(e3).add(t2);
    else {
      var n2 = /* @__PURE__ */ new Set();
      n2.add(t2), this.names.set(e3, n2);
    }
  }, e2.prototype.insertRules = function(e3, t2, n2) {
    this.registerName(e3, t2), this.getTag().insertRules(Se$1(e3), n2);
  }, e2.prototype.clearNames = function(e3) {
    this.names.has(e3) && this.names.get(e3).clear();
  }, e2.prototype.clearRules = function(e3) {
    this.getTag().clearGroup(Se$1(e3)), this.clearNames(e3);
  }, e2.prototype.clearTag = function() {
    this.tag = void 0;
  }, e2;
})(), je$1 = /&/g, xe$1 = /^\s*\/\/.*$/gm;
function Ve$1(e2, t2) {
  return e2.map(function(e3) {
    return "rule" === e3.type && (e3.value = "".concat(t2, " ").concat(e3.value), e3.value = e3.value.replaceAll(",", ",".concat(t2, " ")), e3.props = e3.props.map(function(e4) {
      return "".concat(t2, " ").concat(e4);
    })), Array.isArray(e3.children) && "@keyframes" !== e3.type && (e3.children = Ve$1(e3.children, t2)), e3;
  });
}
function Fe$1(e2) {
  var t2, n2, o2, r2 = C$1 , s2 = r2.options, i2 = void 0 === s2 ? C$1 : s2, a2 = r2.plugins, c2 = void 0 === a2 ? _$1 : a2, l2 = function(e3, o3, r3) {
    return r3.startsWith(n2) && r3.endsWith(n2) && r3.replaceAll(n2, "").length > 0 ? ".".concat(t2) : e3;
  }, u2 = c2.slice();
  u2.push(function(e3) {
    e3.type === RULESET && e3.value.includes("&") && (e3.props[0] = e3.props[0].replace(je$1, n2).replace(o2, l2));
  }), i2.prefix && u2.push(prefixer), u2.push(stringify);
  var p2 = function(e3, r3, s3, a3) {
    void 0 === r3 && (r3 = ""), void 0 === s3 && (s3 = ""), void 0 === a3 && (a3 = "&"), t2 = a3, n2 = r3, o2 = new RegExp("\\".concat(n2, "\\b"), "g");
    var c3 = e3.replace(xe$1, ""), l3 = compile(s3 || r3 ? "".concat(s3, " ").concat(r3, " { ").concat(c3, " }") : c3);
    i2.namespace && (l3 = Ve$1(l3, i2.namespace));
    var p3 = [];
    return serialize(l3, middleware(u2.concat(rulesheet(function(e4) {
      return p3.push(e4);
    })))), p3;
  };
  return p2.hash = c2.length ? c2.reduce(function(e3, t3) {
    return t3.name || he$1(15), M$1(e3, t3.name);
  }, F$1).toString() : "", p2;
}
var Me$1 = new ke$1(), ze$1 = Fe$1(), $e$1 = o.createContext({ shouldForwardProp: void 0, styleSheet: Me$1, stylis: ze$1 }); $e$1.Consumer; o.createContext(void 0);
function Ge$1() {
  return c$1($e$1);
}
var We$1 = (function() {
  function e2(e3, t2) {
    var n2 = this;
    this.inject = function(e4, t3) {
      void 0 === t3 && (t3 = ze$1);
      var o2 = n2.name + t3.hash;
      e4.hasNameForId(n2.id, o2) || e4.insertRules(n2.id, o2, t3(n2.rules, o2, "@keyframes"));
    }, this.name = e3, this.id = "sc-keyframes-".concat(e3), this.rules = t2, ue$1(this, function() {
      throw he$1(12, String(n2.name));
    });
  }
  return e2.prototype.getName = function(e3) {
    return void 0 === e3 && (e3 = ze$1), this.name + e3.hash;
  }, e2;
})(), qe$1 = function(e2) {
  return e2 >= "A" && e2 <= "Z";
};
function He$1(e2) {
  for (var t2 = "", n2 = 0; n2 < e2.length; n2++) {
    var o2 = e2[n2];
    if (1 === n2 && "-" === o2 && "-" === e2[0]) return e2;
    qe$1(o2) ? t2 += "-" + o2.toLowerCase() : t2 += o2;
  }
  return t2.startsWith("ms-") ? "-" + t2 : t2;
}
var Ue$1 = function(e2) {
  return null == e2 || false === e2 || "" === e2;
}, Je = function(t2) {
  var n2, o2, r2 = [];
  for (var s2 in t2) {
    var i2 = t2[s2];
    t2.hasOwnProperty(s2) && !Ue$1(i2) && (Array.isArray(i2) && i2.isCss || re$1(i2) ? r2.push("".concat(He$1(s2), ":"), i2, ";") : ce$1(i2) ? r2.push.apply(r2, __spreadArray(__spreadArray(["".concat(s2, " {")], Je(i2), false), ["}"], false)) : r2.push("".concat(He$1(s2), ": ").concat((n2 = s2, null == (o2 = i2) || "boolean" == typeof o2 || "" === o2 ? "" : "number" != typeof o2 || 0 === o2 || n2 in unitlessKeys || n2.startsWith("--") ? String(o2).trim() : "".concat(o2, "px")), ";")));
  }
  return r2;
};
function Xe$1(e2, t2, n2, o2) {
  if (Ue$1(e2)) return [];
  if (se$1(e2)) return [".".concat(e2.styledComponentId)];
  if (re$1(e2)) {
    if (!re$1(s2 = e2) || s2.prototype && s2.prototype.isReactComponent || !t2) return [e2];
    var r2 = e2(t2);
    return Xe$1(r2, t2, n2, o2);
  }
  var s2;
  return e2 instanceof We$1 ? n2 ? (e2.inject(n2, o2), [e2.getName(o2)]) : [e2] : ce$1(e2) ? Je(e2) : Array.isArray(e2) ? Array.prototype.concat.apply(_$1, e2.map(function(e3) {
    return Xe$1(e3, t2, n2, o2);
  })) : [e2.toString()];
}
function Ze(e2) {
  for (var t2 = 0; t2 < e2.length; t2 += 1) {
    var n2 = e2[t2];
    if (re$1(n2) && !se$1(n2)) return false;
  }
  return true;
}
var Ke$1 = z$1(v$1), Qe$1 = (function() {
  function e2(e3, t2, n2) {
    this.rules = e3, this.staticRulesId = "", this.isStatic = (void 0 === n2 || n2.isStatic) && Ze(e3), this.componentId = t2, this.baseHash = M$1(Ke$1, t2), this.baseStyle = n2, ke$1.registerId(t2);
  }
  return e2.prototype.generateAndInjectStyles = function(e3, t2, n2) {
    var o2 = this.baseStyle ? this.baseStyle.generateAndInjectStyles(e3, t2, n2) : "";
    if (this.isStatic && !n2.hash) if (this.staticRulesId && t2.hasNameForId(this.componentId, this.staticRulesId)) o2 = ie$1(o2, this.staticRulesId);
    else {
      var r2 = ae$1(Xe$1(this.rules, e3, t2, n2)), s2 = x$1(M$1(this.baseHash, r2) >>> 0);
      if (!t2.hasNameForId(this.componentId, s2)) {
        var i2 = n2(r2, ".".concat(s2), void 0, this.componentId);
        t2.insertRules(this.componentId, s2, i2);
      }
      o2 = ie$1(o2, s2), this.staticRulesId = s2;
    }
    else {
      for (var a2 = M$1(this.baseHash, n2.hash), c2 = "", l2 = 0; l2 < this.rules.length; l2++) {
        var u2 = this.rules[l2];
        if ("string" == typeof u2) c2 += u2;
        else if (u2) {
          var p2 = ae$1(Xe$1(u2, e3, t2, n2));
          a2 = M$1(a2, p2 + l2), c2 += p2;
        }
      }
      if (c2) {
        var d2 = x$1(a2 >>> 0);
        t2.hasNameForId(this.componentId, d2) || t2.insertRules(this.componentId, d2, n2(c2, ".".concat(d2), void 0, this.componentId)), o2 = ie$1(o2, d2);
      }
    }
    return o2;
  }, e2;
})(), et = o.createContext(void 0); et.Consumer;
function ot(e2) {
  var n2 = o.useContext(et), r2 = i$1(function() {
    return (function(e3, n3) {
      if (!e3) throw he$1(14);
      if (re$1(e3)) {
        var o2 = e3(n3);
        return o2;
      }
      if (Array.isArray(e3) || "object" != typeof e3) throw he$1(8);
      return n3 ? __assign(__assign({}, n3), e3) : e3;
    })(e2.theme, n2);
  }, [e2.theme, n2]);
  return e2.children ? o.createElement(et.Provider, { value: r2 }, e2.children) : null;
}
var rt = {};
function it(e2, r2, s2) {
  var i2 = se$1(e2), a2 = e2, c2 = !L$1(e2), p2 = r2.attrs, d2 = void 0 === p2 ? _$1 : p2, h2 = r2.componentId, f2 = void 0 === h2 ? (function(e3, t2) {
    var n2 = "string" != typeof e3 ? "sc" : R$1(e3);
    rt[n2] = (rt[n2] || 0) + 1;
    var o2 = "".concat(n2, "-").concat($$1(v$1 + n2 + rt[n2]));
    return t2 ? "".concat(t2, "-").concat(o2) : o2;
  })(r2.displayName, r2.parentComponentId) : h2, m2 = r2.displayName, y2 = void 0 === m2 ? (function(e3) {
    return L$1(e3) ? "styled.".concat(e3) : "Styled(".concat(B$1(e3), ")");
  })(e2) : m2, g2 = r2.displayName && r2.componentId ? "".concat(R$1(r2.displayName), "-").concat(r2.componentId) : r2.componentId || f2, S2 = i2 && a2.attrs ? a2.attrs.concat(d2).filter(Boolean) : d2, w2 = r2.shouldForwardProp;
  if (i2 && a2.shouldForwardProp) {
    var b2 = a2.shouldForwardProp;
    if (r2.shouldForwardProp) {
      var E2 = r2.shouldForwardProp;
      w2 = function(e3, t2) {
        return b2(e3, t2) && E2(e3, t2);
      };
    } else w2 = b2;
  }
  var N2 = new Qe$1(s2, g2, i2 ? a2.componentStyle : void 0);
  function O2(e3, r3) {
    return (function(e4, r4, s3) {
      var i3 = e4.attrs, a3 = e4.componentStyle, c3 = e4.defaultProps, p3 = e4.foldedComponentIds, d3 = e4.styledComponentId, h3 = e4.target, f3 = o.useContext(et), m3 = Ge$1(), y3 = e4.shouldForwardProp || m3.shouldForwardProp;
      var v2 = I$1(r4, f3, c3) || C$1, g3 = (function(e5, n2, o2) {
        for (var r5, s4 = __assign(__assign({}, n2), { className: void 0, theme: o2 }), i4 = 0; i4 < e5.length; i4 += 1) {
          var a4 = re$1(r5 = e5[i4]) ? r5(s4) : r5;
          for (var c4 in a4) s4[c4] = "className" === c4 ? ie$1(s4[c4], a4[c4]) : "style" === c4 ? __assign(__assign({}, s4[c4]), a4[c4]) : a4[c4];
        }
        return n2.className && (s4.className = ie$1(s4.className, n2.className)), s4;
      })(i3, r4, v2), S3 = g3.as || h3, w3 = {};
      for (var b3 in g3) void 0 === g3[b3] || "$" === b3[0] || "as" === b3 || "theme" === b3 && g3.theme === v2 || ("forwardedAs" === b3 ? w3.as = g3.forwardedAs : y3 && !y3(b3, S3) || (w3[b3] = g3[b3], y3 || true));
      var E3 = (function(e5, t2) {
        var n2 = Ge$1(), o2 = e5.generateAndInjectStyles(t2, n2.styleSheet, n2.stylis);
        return o2;
      })(a3, g3);
      var N3 = ie$1(p3, d3);
      return E3 && (N3 += " " + E3), g3.className && (N3 += " " + g3.className), w3[L$1(S3) && !A$1.has(S3) ? "class" : "className"] = N3, s3 && (w3.ref = s3), u$1(S3, w3);
    })(D2, e3, r3);
  }
  O2.displayName = y2;
  var D2 = o.forwardRef(O2);
  return D2.attrs = S2, D2.componentStyle = N2, D2.displayName = y2, D2.shouldForwardProp = w2, D2.foldedComponentIds = i2 ? ie$1(a2.foldedComponentIds, a2.styledComponentId) : "", D2.styledComponentId = g2, D2.target = i2 ? a2.target : e2, Object.defineProperty(D2, "defaultProps", { get: function() {
    return this._foldedDefaultProps;
  }, set: function(e3) {
    this._foldedDefaultProps = i2 ? (function(e4) {
      for (var t2 = [], n2 = 1; n2 < arguments.length; n2++) t2[n2 - 1] = arguments[n2];
      for (var o2 = 0, r3 = t2; o2 < r3.length; o2++) le$1(e4, r3[o2], true);
      return e4;
    })({}, a2.defaultProps, e3) : e3;
  } }), ue$1(D2, function() {
    return ".".concat(D2.styledComponentId);
  }), c2 && oe$1(D2, e2, { attrs: true, componentStyle: true, displayName: true, foldedComponentIds: true, shouldForwardProp: true, styledComponentId: true, target: true }), D2;
}
function at(e2, t2) {
  for (var n2 = [e2[0]], o2 = 0, r2 = t2.length; o2 < r2; o2 += 1) n2.push(t2[o2], e2[o2 + 1]);
  return n2;
}
var ct = function(e2) {
  return Object.assign(e2, { isCss: true });
};
function lt(t2) {
  for (var n2 = [], o2 = 1; o2 < arguments.length; o2++) n2[o2 - 1] = arguments[o2];
  if (re$1(t2) || ce$1(t2)) return ct(Xe$1(at(_$1, __spreadArray([t2], n2, true))));
  var r2 = t2;
  return 0 === n2.length && 1 === r2.length && "string" == typeof r2[0] ? Xe$1(r2) : ct(Xe$1(at(r2, n2)));
}
function ut(n2, o2, r2) {
  if (void 0 === r2 && (r2 = C$1), !o2) throw he$1(1, o2);
  var s2 = function(t2) {
    for (var s3 = [], i2 = 1; i2 < arguments.length; i2++) s3[i2 - 1] = arguments[i2];
    return n2(o2, r2, lt.apply(void 0, __spreadArray([t2], s3, false)));
  };
  return s2.attrs = function(e2) {
    return ut(n2, o2, __assign(__assign({}, r2), { attrs: Array.prototype.concat(r2.attrs, e2).filter(Boolean) }));
  }, s2.withConfig = function(e2) {
    return ut(n2, o2, __assign(__assign({}, r2), e2));
  }, s2;
}
var pt = function(e2) {
  return ut(it, e2);
}, dt = pt;
A$1.forEach(function(e2) {
  dt[e2] = pt(e2);
});

const e = await importShared('react');
const t = await importShared('react');
var l;function r(e,t){return e[t]}function i(e=[],t,n=0){return [...e.slice(0,n),t,...e.slice(n)]}function s(e=[],t,n="id"){const o=e.slice(),a=r(t,n);return a?o.splice(o.findIndex((e=>r(e,n)===a)),1):o.splice(o.findIndex((e=>e===t)),1),o}function d(e){return e.map(((e,t)=>{const n=Object.assign(Object.assign({},e),{sortable:e.sortable||!!e.sortFunction||void 0});return e.id||(n.id=t+1),n}))}function c(e,t){return Math.ceil(e/t)}function g(e,t){return Math.min(e,t)}!function(e){e.ASC="asc",e.DESC="desc";}(l||(l={}));const u=()=>null;function p(e,t=[],n=[]){let o={},a=[...n];return t.length&&t.forEach((t=>{if(!t.when||"function"!=typeof t.when)throw new Error('"when" must be defined in the conditional style object and must be function');t.when(e)&&(o=t.style||{},t.classNames&&(a=[...a,...t.classNames]),"function"==typeof t.style&&(o=t.style(e)||{}));})),{conditionalStyle:o,classNames:a.join(" ")}}function b(e,t=[],n="id"){const o=r(e,n);return o?t.some((e=>r(e,n)===o)):t.some((t=>t===e))}function m(e,t){return t?e.findIndex((e=>h(e.id,t))):-1}function h(e,t){return e==t}function w(e,t){const n=!e.toggleOnSelectedRowsChange;switch(t.type){case "SELECT_ALL_ROWS":{const{keyField:n,rows:o,rowCount:a,mergeSelections:l}=t,r=!e.allSelected,i=!e.toggleOnSelectedRowsChange;if(l){const t=r?[...e.selectedRows,...o.filter((t=>!b(t,e.selectedRows,n)))]:e.selectedRows.filter((e=>!b(e,o,n)));return Object.assign(Object.assign({},e),{allSelected:r,selectedCount:t.length,selectedRows:t,toggleOnSelectedRowsChange:i})}return Object.assign(Object.assign({},e),{allSelected:r,selectedCount:r?a:0,selectedRows:r?o:[],toggleOnSelectedRowsChange:i})}case "SELECT_SINGLE_ROW":{const{keyField:o,row:a,isSelected:l,rowCount:r,singleSelect:d}=t;return d?l?Object.assign(Object.assign({},e),{selectedCount:0,allSelected:false,selectedRows:[],toggleOnSelectedRowsChange:n}):Object.assign(Object.assign({},e),{selectedCount:1,allSelected:false,selectedRows:[a],toggleOnSelectedRowsChange:n}):l?Object.assign(Object.assign({},e),{selectedCount:e.selectedRows.length>0?e.selectedRows.length-1:0,allSelected:false,selectedRows:s(e.selectedRows,a,o),toggleOnSelectedRowsChange:n}):Object.assign(Object.assign({},e),{selectedCount:e.selectedRows.length+1,allSelected:e.selectedRows.length+1===r,selectedRows:i(e.selectedRows,a),toggleOnSelectedRowsChange:n})}case "SELECT_MULTIPLE_ROWS":{const{keyField:o,selectedRows:a,totalRows:l,mergeSelections:r}=t;if(r){const t=[...e.selectedRows,...a.filter((t=>!b(t,e.selectedRows,o)))];return Object.assign(Object.assign({},e),{selectedCount:t.length,allSelected:false,selectedRows:t,toggleOnSelectedRowsChange:n})}return Object.assign(Object.assign({},e),{selectedCount:a.length,allSelected:a.length===l,selectedRows:a,toggleOnSelectedRowsChange:n})}case "CLEAR_SELECTED_ROWS":{const{selectedRowsFlag:n}=t;return Object.assign(Object.assign({},e),{allSelected:false,selectedCount:0,selectedRows:[],selectedRowsFlag:n})}case "SORT_CHANGE":{const{sortDirection:o,selectedColumn:a,clearSelectedOnSort:l}=t;return Object.assign(Object.assign(Object.assign({},e),{selectedColumn:a,sortDirection:o,currentPage:1}),l&&{allSelected:false,selectedCount:0,selectedRows:[],toggleOnSelectedRowsChange:n})}case "CHANGE_PAGE":{const{page:o,paginationServer:a,visibleOnly:l,persistSelectedOnPageChange:r}=t,i=a&&r,s=a&&!r||l;return Object.assign(Object.assign(Object.assign(Object.assign({},e),{currentPage:o}),i&&{allSelected:false}),s&&{allSelected:false,selectedCount:0,selectedRows:[],toggleOnSelectedRowsChange:n})}case "CHANGE_ROWS_PER_PAGE":{const{rowsPerPage:n,page:o}=t;return Object.assign(Object.assign({},e),{currentPage:o,rowsPerPage:n})}}}const f=lt`
	pointer-events: none;
	opacity: 0.4;
`,x=dt.div`
	position: relative;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	max-width: 100%;
	${({disabled:e})=>e&&f};
	${({theme:e})=>e.table.style};
`,C=lt`
	position: sticky;
	position: -webkit-sticky; /* Safari */
	top: 0;
	z-index: 1;
`,y=dt.div`
	display: flex;
	width: 100%;
	${({$fixedHeader:e})=>e&&C};
	${({theme:e})=>e.head.style};
`,R=dt.div`
	display: flex;
	align-items: stretch;
	width: 100%;
	${({theme:e})=>e.headRow.style};
	${({$dense:e,theme:t})=>e&&t.headRow.denseStyle};
`,v=(e,...t)=>lt`
		@media screen and (max-width: ${599}px) {
			${lt(e,...t)}
		}
	`,S=(e,...t)=>lt`
		@media screen and (max-width: ${959}px) {
			${lt(e,...t)}
		}
	`,E=(e,...t)=>lt`
		@media screen and (max-width: ${1280}px) {
			${lt(e,...t)}
		}
	`,O=e=>(t,...n)=>lt`
			@media screen and (max-width: ${e}px) {
				${lt(t,...n)}
			}
		`,$=dt.div`
	position: relative;
	display: flex;
	align-items: center;
	box-sizing: border-box;
	line-height: normal;
	${({theme:e,$headCell:t})=>e[t?"headCells":"cells"].style};
	${({$noPadding:e})=>e&&"padding: 0"};
`,k=dt($)`
	flex-grow: ${({button:e,grow:t})=>0===t||e?0:t||1};
	flex-shrink: 0;
	flex-basis: 0;
	max-width: ${({maxWidth:e})=>e||"100%"};
	min-width: ${({minWidth:e})=>e||"100px"};
	${({width:e})=>e&&lt`
			min-width: ${e};
			max-width: ${e};
		`};
	${({right:e})=>e&&"justify-content: flex-end"};
	${({button:e,center:t})=>(t||e)&&"justify-content: center"};
	${({compact:e,button:t})=>(e||t)&&"padding: 0"};

	/* handle hiding cells */
	${({hide:e})=>e&&"sm"===e&&v`
    display: none;
  `};
	${({hide:e})=>e&&"md"===e&&S`
    display: none;
  `};
	${({hide:e})=>e&&"lg"===e&&E`
    display: none;
  `};
	${({hide:e})=>e&&Number.isInteger(e)&&O(e)`
    display: none;
  `};
`,P=lt`
	div:first-child {
		white-space: ${({$wrapCell:e})=>e?"normal":"nowrap"};
		overflow: ${({$allowOverflow:e})=>e?"visible":"hidden"};
		text-overflow: ellipsis;
	}
`,D=dt(k).attrs((e=>({style:e.style})))`
	${({$renderAsCell:e})=>!e&&P};
	${({theme:e,$isDragging:t})=>t&&e.cells.draggingStyle};
	${({$cellStyle:e})=>e};
`;var H=e.memo((function({id:t,column:n,row:o,rowIndex:a,dataTag:l,isDragging:r,onDragStart:i,onDragOver:s,onDragEnd:d,onDragEnter:c,onDragLeave:g}){const{conditionalStyle:u,classNames:b}=p(o,n.conditionalCellStyles,["rdt_TableCell"]);return e.createElement(D,{id:t,"data-column-id":n.id,role:"cell",className:b,"data-tag":l,$cellStyle:n.style,$renderAsCell:!!n.cell,$allowOverflow:n.allowOverflow,button:n.button,center:n.center,compact:n.compact,grow:n.grow,hide:n.hide,maxWidth:n.maxWidth,minWidth:n.minWidth,right:n.right,width:n.width,$wrapCell:n.wrap,style:u,$isDragging:r,onDragStart:i,onDragOver:s,onDragEnd:d,onDragEnter:c,onDragLeave:g},!n.cell&&e.createElement("div",{"data-tag":l},function(e,t,n,o){return t?n&&"function"==typeof n?n(e,o):t(e,o):null}(o,n.selector,n.format,a)),n.cell&&n.cell(o,a,n,t))}));const F="input";var j=e.memo((function({name:t,component:n=F,componentOptions:o={style:{}},indeterminate:a=false,checked:l=false,disabled:r=false,onClick:i=u}){const s=n,d=s!==F?o.style:(e=>Object.assign(Object.assign({fontSize:"18px"},!e&&{cursor:"pointer"}),{padding:0,marginTop:"1px",verticalAlign:"middle",position:"relative"}))(r),c=e.useMemo((()=>function(e,...t){let n;return Object.keys(e).map((t=>e[t])).forEach(((o,a)=>{const l=e;"function"==typeof o&&(n=Object.assign(Object.assign({},l),{[Object.keys(e)[a]]:o(...t)}));})),n||e}(o,a)),[o,a]);return e.createElement(s,Object.assign({type:"checkbox",ref:e=>{e&&(e.indeterminate=a);},style:d,onClick:r?u:i,name:t,"aria-label":t,checked:l,disabled:r},c,{onChange:u}))}));const I=dt($)`
	flex: 0 0 48px;
	min-width: 48px;
	justify-content: center;
	align-items: center;
	user-select: none;
	white-space: nowrap;
`;function T({name:t,keyField:n,row:o,rowCount:a,selected:l,selectableRowsComponent:r,selectableRowsComponentProps:i,selectableRowsSingle:s,selectableRowDisabled:d,onSelectedRow:c}){const g=!(!d||!d(o));return e.createElement(I,{onClick:e=>e.stopPropagation(),className:"rdt_TableCell",$noPadding:true},e.createElement(j,{name:t,component:r,componentOptions:i,checked:l,"aria-checked":l,onClick:()=>{c({type:"SELECT_SINGLE_ROW",row:o,isSelected:l,keyField:n,rowCount:a,singleSelect:s});},disabled:g}))}const L=dt.button`
	display: inline-flex;
	align-items: center;
	user-select: none;
	white-space: nowrap;
	border: none;
	background-color: transparent;
	${({theme:e})=>e.expanderButton.style};
`;function M({disabled:t=false,expanded:n=false,expandableIcon:o,id:a,row:l,onToggled:r}){const i=n?o.expanded:o.collapsed;return e.createElement(L,{"aria-disabled":t,onClick:()=>r&&r(l),"data-testid":`expander-button-${a}`,disabled:t,"aria-label":n?"Collapse Row":"Expand Row",role:"button",type:"button"},i)}const A=dt($)`
	white-space: nowrap;
	font-weight: 400;
	min-width: 48px;
	${({theme:e})=>e.expanderCell.style};
`;function _({row:t,expanded:n=false,expandableIcon:o,id:a,onToggled:l,disabled:r=false}){return e.createElement(A,{onClick:e=>e.stopPropagation(),$noPadding:true},e.createElement(M,{id:a,row:t,expanded:n,expandableIcon:o,disabled:r,onToggled:l}))}const N=dt.div`
	width: 100%;
	box-sizing: border-box;
	${({theme:e})=>e.expanderRow.style};
	${({$extendedRowStyle:e})=>e};
`;var z=e.memo((function({data:t,ExpanderComponent:n,expanderComponentProps:o,extendedRowStyle:a,extendedClassNames:l}){const r=["rdt_ExpanderRow",...l.split(" ").filter((e=>"rdt_TableRow"!==e))].join(" ");return e.createElement(N,{className:r,$extendedRowStyle:a},e.createElement(n,Object.assign({data:t},o)))}));const W="allowRowEvents";var B,G,V;!function(e){e.LTR="ltr",e.RTL="rtl",e.AUTO="auto";}(B||(B={})),function(e){e.LEFT="left",e.RIGHT="right",e.CENTER="center";}(G||(G={})),function(e){e.SM="sm",e.MD="md",e.LG="lg";}(V||(V={}));const U=lt`
	&:hover {
		${({$highlightOnHover:e,theme:t})=>e&&t.rows.highlightOnHoverStyle};
	}
`,Y=lt`
	&:hover {
		cursor: pointer;
	}
`,K=dt.div.attrs((e=>({style:e.style})))`
	display: flex;
	align-items: stretch;
	align-content: stretch;
	width: 100%;
	box-sizing: border-box;
	${({theme:e})=>e.rows.style};
	${({$dense:e,theme:t})=>e&&t.rows.denseStyle};
	${({$striped:e,theme:t})=>e&&t.rows.stripedStyle};
	${({$highlightOnHover:e})=>e&&U};
	${({$pointerOnHover:e})=>e&&Y};
	${({$selected:e,theme:t})=>e&&t.rows.selectedHighlightStyle};
	${({$conditionalStyle:e})=>e};
`;function q({columns:t=[],conditionalRowStyles:n=[],defaultExpanded:o=false,defaultExpanderDisabled:a=false,dense:l=false,expandableIcon:i,expandableRows:s=false,expandableRowsComponent:d,expandableRowsComponentProps:c,expandableRowsHideExpander:g,expandOnRowClicked:b=false,expandOnRowDoubleClicked:m=false,highlightOnHover:w=false,id:f,expandableInheritConditionalStyles:x,keyField:C,onRowClicked:y=u,onRowDoubleClicked:R=u,onRowMouseEnter:v=u,onRowMouseLeave:S=u,onRowExpandToggled:E=u,onSelectedRow:O=u,pointerOnHover:$=false,row:k,rowCount:P,rowIndex:D,selectableRowDisabled:F=null,selectableRows:j=false,selectableRowsComponent:I,selectableRowsComponentProps:L,selectableRowsHighlight:M=false,selectableRowsSingle:A=false,selected:N,striped:B=false,draggingColumnId:G,onDragStart:V,onDragOver:U,onDragEnd:Y,onDragEnter:q,onDragLeave:J}){const[Q,X]=e.useState(o);e.useEffect((()=>{X(o);}),[o]);const Z=e.useCallback((()=>{X(!Q),E(!Q,k);}),[Q,E,k]),ee=$||s&&(b||m),te=e.useCallback((e=>{e.target.getAttribute("data-tag")===W&&(y(k,e),!a&&s&&b&&Z());}),[a,b,s,Z,y,k]),ne=e.useCallback((e=>{e.target.getAttribute("data-tag")===W&&(R(k,e),!a&&s&&m&&Z());}),[a,m,s,Z,R,k]),oe=e.useCallback((e=>{v(k,e);}),[v,k]),ae=e.useCallback((e=>{S(k,e);}),[S,k]),le=r(k,C),{conditionalStyle:re,classNames:ie}=p(k,n,["rdt_TableRow"]),se=M&&N,de=x?re:{},ce=B&&D%2==0;return e.createElement(e.Fragment,null,e.createElement(K,{id:`row-${f}`,role:"row",$striped:ce,$highlightOnHover:w,$pointerOnHover:!a&&ee,$dense:l,onClick:te,onDoubleClick:ne,onMouseEnter:oe,onMouseLeave:ae,className:ie,$selected:se,$conditionalStyle:re},j&&e.createElement(T,{name:`select-row-${le}`,keyField:C,row:k,rowCount:P,selected:N,selectableRowsComponent:I,selectableRowsComponentProps:L,selectableRowDisabled:F,selectableRowsSingle:A,onSelectedRow:O}),s&&!g&&e.createElement(_,{id:le,expandableIcon:i,expanded:Q,row:k,onToggled:Z,disabled:a}),t.map((t=>t.omit?null:e.createElement(H,{id:`cell-${t.id}-${le}`,key:`cell-${t.id}-${le}`,dataTag:t.ignoreRowClick||t.button?null:W,column:t,row:k,rowIndex:D,isDragging:h(G,t.id),onDragStart:V,onDragOver:U,onDragEnd:Y,onDragEnter:q,onDragLeave:J})))),s&&Q&&e.createElement(z,{key:`expander-${le}`,data:k,extendedRowStyle:de,extendedClassNames:ie,ExpanderComponent:d,expanderComponentProps:c}))}const J=dt.span`
	padding: 2px;
	color: inherit;
	flex-grow: 0;
	flex-shrink: 0;
	${({$sortActive:e})=>e?"opacity: 1":"opacity: 0"};
	${({$sortDirection:e})=>"desc"===e&&"transform: rotate(180deg)"};
`,Q=({sortActive:e,sortDirection:n})=>t.createElement(J,{$sortActive:e,$sortDirection:n},"▲"),X=dt(k)`
	${({button:e})=>e&&"text-align: center"};
	${({theme:e,$isDragging:t})=>t&&e.headCells.draggingStyle};
`,Z=lt`
	cursor: pointer;
	span.__rdt_custom_sort_icon__ {
		i,
		svg {
			transform: 'translate3d(0, 0, 0)';
			${({$sortActive:e})=>e?"opacity: 1":"opacity: 0"};
			color: inherit;
			font-size: 18px;
			height: 18px;
			width: 18px;
			backface-visibility: hidden;
			transform-style: preserve-3d;
			transition-duration: 95ms;
			transition-property: transform;
		}

		&.asc i,
		&.asc svg {
			transform: rotate(180deg);
		}
	}

	${({$sortActive:e})=>!e&&lt`
			&:hover,
			&:focus {
				opacity: 0.7;

				span,
				span.__rdt_custom_sort_icon__ * {
					opacity: 0.7;
				}
			}
		`};
`,ee=dt.div`
	display: inline-flex;
	align-items: center;
	justify-content: inherit;
	height: 100%;
	width: 100%;
	outline: none;
	user-select: none;
	overflow: hidden;
	${({disabled:e})=>!e&&Z};
`,te=dt.div`
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
`;var ne=e.memo((function({column:t,disabled:n,draggingColumnId:o,selectedColumn:a={},sortDirection:r,sortIcon:i,sortServer:s,pagination:d,paginationServer:c,persistSelectedOnSort:g,selectableRowsVisibleOnly:u,onSort:p,onDragStart:b,onDragOver:m,onDragEnd:w,onDragEnter:f,onDragLeave:x}){e.useEffect((()=>{"string"==typeof t.selector&&console.error(`Warning: ${t.selector} is a string based column selector which has been deprecated as of v7 and will be removed in v8. Instead, use a selector function e.g. row => row[field]...`);}),[]);const[C,y]=e.useState(false),R=e.useRef(null);if(e.useEffect((()=>{R.current&&y(R.current.scrollWidth>R.current.clientWidth);}),[C]),t.omit)return null;const v=()=>{if(!t.sortable&&!t.selector)return;let e=r;h(a.id,t.id)&&(e=r===l.ASC?l.DESC:l.ASC),p({type:"SORT_CHANGE",sortDirection:e,selectedColumn:t,clearSelectedOnSort:d&&c&&!g||s||u});},S=t=>e.createElement(Q,{sortActive:t,sortDirection:r}),E=()=>e.createElement("span",{className:[r,"__rdt_custom_sort_icon__"].join(" ")},i),O=!(!t.sortable||!h(a.id,t.id)),$=!t.sortable||n,k=t.sortable&&!i&&!t.right,P=t.sortable&&!i&&t.right,D=t.sortable&&i&&!t.right,H=t.sortable&&i&&t.right;return e.createElement(X,{"data-column-id":t.id,className:"rdt_TableCol",$headCell:true,allowOverflow:t.allowOverflow,button:t.button,compact:t.compact,grow:t.grow,hide:t.hide,maxWidth:t.maxWidth,minWidth:t.minWidth,right:t.right,center:t.center,width:t.width,draggable:t.reorder,$isDragging:h(t.id,o),onDragStart:b,onDragOver:m,onDragEnd:w,onDragEnter:f,onDragLeave:x},t.name&&e.createElement(ee,{"data-column-id":t.id,"data-sort-id":t.id,role:"columnheader",tabIndex:0,className:"rdt_TableCol_Sortable",onClick:$?void 0:v,onKeyPress:$?void 0:e=>{"Enter"===e.key&&v();},$sortActive:!$&&O,disabled:$},!$&&H&&E(),!$&&P&&S(O),"string"==typeof t.name?e.createElement(te,{title:C?t.name:void 0,ref:R,"data-column-id":t.id},t.name):t.name,!$&&D&&E(),!$&&k&&S(O)))}));const oe=dt($)`
	flex: 0 0 48px;
	justify-content: center;
	align-items: center;
	user-select: none;
	white-space: nowrap;
	font-size: unset;
`;function ae({headCell:t=true,rowData:n,keyField:o,allSelected:a,mergeSelections:l,selectedRows:r,selectableRowsComponent:i,selectableRowsComponentProps:s,selectableRowDisabled:d,onSelectAllRows:c}){const g=r.length>0&&!a,u=d?n.filter((e=>!d(e))):n,p=0===u.length,b=Math.min(n.length,u.length);return e.createElement(oe,{className:"rdt_TableCol",$headCell:t,$noPadding:true},e.createElement(j,{name:"select-all-rows",component:i,componentOptions:s,onClick:()=>{c({type:"SELECT_ALL_ROWS",rows:u,rowCount:b,mergeSelections:l,keyField:o});},checked:a,indeterminate:g,disabled:p}))}function le(t=B.AUTO){const n="object"==typeof window,[o,a]=e.useState(false);return e.useEffect((()=>{if(n)if("auto"!==t)a("rtl"===t);else {const e=!(!window.document||!window.document.createElement),t=document.getElementsByTagName("BODY")[0],n=document.getElementsByTagName("HTML")[0],o="rtl"===t.dir||"rtl"===n.dir;a(e&&o);}}),[t,n]),o}const re=dt.div`
	display: flex;
	align-items: center;
	flex: 1 0 auto;
	height: 100%;
	color: ${({theme:e})=>e.contextMenu.fontColor};
	font-size: ${({theme:e})=>e.contextMenu.fontSize};
	font-weight: 400;
`,ie=dt.div`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	flex-wrap: wrap;
`,se=dt.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	box-sizing: inherit;
	z-index: 1;
	align-items: center;
	justify-content: space-between;
	display: flex;
	${({$rtl:e})=>e&&"direction: rtl"};
	${({theme:e})=>e.contextMenu.style};
	${({theme:e,$visible:t})=>t&&e.contextMenu.activeStyle};
`;function de({contextMessage:t,contextActions:n,contextComponent:o,selectedCount:a,direction:l}){const r=le(l),i=a>0;return o?e.createElement(se,{$visible:i},e.cloneElement(o,{selectedCount:a})):e.createElement(se,{$visible:i,$rtl:r},e.createElement(re,null,((e,t,n)=>{if(0===t)return null;const o=1===t?e.singular:e.plural;return n?`${t} ${e.message||""} ${o}`:`${t} ${o} ${e.message||""}`})(t,a,r)),e.createElement(ie,null,n))}const ce=dt.div`
	position: relative;
	box-sizing: border-box;
	overflow: hidden;
	display: flex;
	flex: 1 1 auto;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	flex-wrap: wrap;
	${({theme:e})=>e.header.style}
`,ge=dt.div`
	flex: 1 0 auto;
	color: ${({theme:e})=>e.header.fontColor};
	font-size: ${({theme:e})=>e.header.fontSize};
	font-weight: 400;
`,ue=dt.div`
	flex: 1 0 auto;
	display: flex;
	align-items: center;
	justify-content: flex-end;

	> * {
		margin-left: 5px;
	}
`,pe=({title:t,actions:n=null,contextMessage:o,contextActions:a,contextComponent:l,selectedCount:r,direction:i,showMenu:s=true})=>e.createElement(ce,{className:"rdt_TableHeader",role:"heading","aria-level":1},e.createElement(ge,null,t),n&&e.createElement(ue,null,n),s&&e.createElement(de,{contextMessage:o,contextActions:a,contextComponent:l,direction:i,selectedCount:r}));function be(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var a=0;for(o=Object.getOwnPropertySymbols(e);a<o.length;a++)t.indexOf(o[a])<0&&Object.prototype.propertyIsEnumerable.call(e,o[a])&&(n[o[a]]=e[o[a]]);}return n}"function"==typeof SuppressedError&&SuppressedError;const me={left:"flex-start",right:"flex-end",center:"center"},he=dt.header`
	position: relative;
	display: flex;
	flex: 1 1 auto;
	box-sizing: border-box;
	align-items: center;
	padding: 4px 16px 4px 24px;
	width: 100%;
	justify-content: ${({align:e})=>me[e]};
	flex-wrap: ${({$wrapContent:e})=>e?"wrap":"nowrap"};
	${({theme:e})=>e.subHeader.style}
`,we=t=>{var{align:n="right",wrapContent:o=true}=t,a=be(t,["align","wrapContent"]);return e.createElement(he,Object.assign({align:n,$wrapContent:o},a))},fe=dt.div`
	display: flex;
	flex-direction: column;
`,xe=dt.div`
	position: relative;
	width: 100%;
	border-radius: inherit;
	${({$responsive:e,$fixedHeader:t})=>e&&lt`
			overflow-x: auto;

			// hidden prevents vertical scrolling in firefox when fixedHeader is disabled
			overflow-y: ${t?"auto":"hidden"};
			min-height: 0;
		`};

	${({$fixedHeader:e=false,$fixedHeaderScrollHeight:t="100vh"})=>e&&lt`
			max-height: ${t};
			-webkit-overflow-scrolling: touch;
		`};

	${({theme:e})=>e.responsiveWrapper.style};
`,Ce=dt.div`
	position: relative;
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	${e=>e.theme.progress.style};
`,ye=dt.div`
	position: relative;
	width: 100%;
	${({theme:e})=>e.tableWrapper.style};
`,Re=dt($)`
	white-space: nowrap;
	${({theme:e})=>e.expanderCell.style};
`,ve=dt.div`
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	${({theme:e})=>e.noData.style};
`,Se=()=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},t.createElement("path",{d:"M7 10l5 5 5-5z"}),t.createElement("path",{d:"M0 0h24v24H0z",fill:"none"})),Ee=dt.select`
	cursor: pointer;
	height: 24px;
	max-width: 100%;
	user-select: none;
	padding-left: 8px;
	padding-right: 24px;
	box-sizing: content-box;
	font-size: inherit;
	color: inherit;
	border: none;
	background-color: transparent;
	appearance: none;
	direction: ltr;
	flex-shrink: 0;

	&::-ms-expand {
		display: none;
	}

	&:disabled::-ms-expand {
		background: #f60;
	}

	option {
		color: initial;
	}
`,Oe=dt.div`
	position: relative;
	flex-shrink: 0;
	font-size: inherit;
	color: inherit;
	margin-top: 1px;

	svg {
		top: 0;
		right: 0;
		color: inherit;
		position: absolute;
		fill: currentColor;
		width: 24px;
		height: 24px;
		display: inline-block;
		user-select: none;
		pointer-events: none;
	}
`,$e=t=>{var{defaultValue:n,onChange:o}=t,a=be(t,["defaultValue","onChange"]);return e.createElement(Oe,null,e.createElement(Ee,Object.assign({onChange:o,defaultValue:n},a)),e.createElement(Se,null))},ke={columns:[],data:[],title:"",keyField:"id",selectableRows:false,selectableRowsHighlight:false,selectableRowsNoSelectAll:false,selectableRowSelected:null,selectableRowDisabled:null,selectableRowsComponent:"input",selectableRowsComponentProps:{},selectableRowsVisibleOnly:false,selectableRowsSingle:false,clearSelectedRows:false,expandableRows:false,expandableRowDisabled:null,expandableRowExpanded:null,expandOnRowClicked:false,expandableRowsHideExpander:false,expandOnRowDoubleClicked:false,expandableInheritConditionalStyles:false,expandableRowsComponent:function(){return t.createElement("div",null,"To add an expander pass in a component instance via ",t.createElement("strong",null,"expandableRowsComponent"),". You can then access props.data from this component.")},expandableIcon:{collapsed:t.createElement((()=>t.createElement("svg",{fill:"currentColor",height:"24",viewBox:"0 0 24 24",width:"24",xmlns:"http://www.w3.org/2000/svg"},t.createElement("path",{d:"M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"}),t.createElement("path",{d:"M0-.25h24v24H0z",fill:"none"}))),null),expanded:t.createElement((()=>t.createElement("svg",{fill:"currentColor",height:"24",viewBox:"0 0 24 24",width:"24",xmlns:"http://www.w3.org/2000/svg"},t.createElement("path",{d:"M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"}),t.createElement("path",{d:"M0-.75h24v24H0z",fill:"none"}))),null)},expandableRowsComponentProps:{},progressPending:false,progressComponent:t.createElement("div",{style:{fontSize:"24px",fontWeight:700,padding:"24px"}},"Loading..."),persistTableHead:false,sortIcon:null,sortFunction:null,sortServer:false,striped:false,highlightOnHover:false,pointerOnHover:false,noContextMenu:false,contextMessage:{singular:"item",plural:"items",message:"selected"},actions:null,contextActions:null,contextComponent:null,defaultSortFieldId:null,defaultSortAsc:true,responsive:true,noDataComponent:t.createElement("div",{style:{padding:"24px"}},"There are no records to display"),disabled:false,noTableHead:false,noHeader:false,subHeader:false,subHeaderAlign:G.RIGHT,subHeaderWrap:true,subHeaderComponent:null,fixedHeader:false,fixedHeaderScrollHeight:"100vh",pagination:false,paginationServer:false,paginationServerOptions:{persistSelectedOnSort:false,persistSelectedOnPageChange:false},paginationDefaultPage:1,paginationResetDefaultPage:false,paginationTotalRows:0,paginationPerPage:10,paginationRowsPerPageOptions:[10,15,20,25,30],paginationComponent:null,paginationComponentOptions:{},paginationIconFirstPage:t.createElement((()=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24","aria-hidden":"true",role:"presentation"},t.createElement("path",{d:"M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"}),t.createElement("path",{fill:"none",d:"M24 24H0V0h24v24z"}))),null),paginationIconLastPage:t.createElement((()=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24","aria-hidden":"true",role:"presentation"},t.createElement("path",{d:"M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"}),t.createElement("path",{fill:"none",d:"M0 0h24v24H0V0z"}))),null),paginationIconNext:t.createElement((()=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24","aria-hidden":"true",role:"presentation"},t.createElement("path",{d:"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"}),t.createElement("path",{d:"M0 0h24v24H0z",fill:"none"}))),null),paginationIconPrevious:t.createElement((()=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24","aria-hidden":"true",role:"presentation"},t.createElement("path",{d:"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"}),t.createElement("path",{d:"M0 0h24v24H0z",fill:"none"}))),null),dense:false,conditionalRowStyles:[],theme:"default",customStyles:{},direction:B.AUTO,onChangePage:u,onChangeRowsPerPage:u,onRowClicked:u,onRowDoubleClicked:u,onRowMouseEnter:u,onRowMouseLeave:u,onRowExpandToggled:u,onSelectedRowsChange:u,onSort:u,onColumnOrderChange:u},Pe={rowsPerPageText:"Rows per page:",rangeSeparatorText:"of",noRowsPerPage:false,selectAllRowsItem:false,selectAllRowsItemText:"All"},De=dt.nav`
	display: flex;
	flex: 1 1 auto;
	justify-content: flex-end;
	align-items: center;
	box-sizing: border-box;
	padding-right: 8px;
	padding-left: 8px;
	width: 100%;
	${({theme:e})=>e.pagination.style};
`,He=dt.button`
	position: relative;
	display: block;
	user-select: none;
	border: none;
	${({theme:e})=>e.pagination.pageButtonsStyle};
	${({$isRTL:e})=>e&&"transform: scale(-1, -1)"};
`,Fe=dt.div`
	display: flex;
	align-items: center;
	border-radius: 4px;
	white-space: nowrap;
	${v`
    width: 100%;
    justify-content: space-around;
  `};
`,je=dt.span`
	flex-shrink: 1;
	user-select: none;
`,Ie=dt(je)`
	margin: 0 24px;
`,Te=dt(je)`
	margin: 0 4px;
`;var Le=e.memo((function({rowsPerPage:t,rowCount:n,currentPage:o,direction:a=ke.direction,paginationRowsPerPageOptions:l=ke.paginationRowsPerPageOptions,paginationIconLastPage:r=ke.paginationIconLastPage,paginationIconFirstPage:i=ke.paginationIconFirstPage,paginationIconNext:s=ke.paginationIconNext,paginationIconPrevious:d=ke.paginationIconPrevious,paginationComponentOptions:g=ke.paginationComponentOptions,onChangeRowsPerPage:u=ke.onChangeRowsPerPage,onChangePage:p=ke.onChangePage}){const b=(()=>{const t="object"==typeof window;function n(){return {width:t?window.innerWidth:void 0,height:t?window.innerHeight:void 0}}const[o,a]=e.useState(n);return e.useEffect((()=>{if(!t)return ()=>null;function e(){a(n());}return window.addEventListener("resize",e),()=>window.removeEventListener("resize",e)}),[]),o})(),m=le(a),h=b.width&&b.width>599,w=c(n,t),f=o*t,x=f-t+1,C=1===o,y=o===w,R=Object.assign(Object.assign({},Pe),g),v=o===w?`${x}-${n} ${R.rangeSeparatorText} ${n}`:`${x}-${f} ${R.rangeSeparatorText} ${n}`,S=e.useCallback((()=>p(o-1)),[o,p]),E=e.useCallback((()=>p(o+1)),[o,p]),O=e.useCallback((()=>p(1)),[p]),$=e.useCallback((()=>p(c(n,t))),[p,n,t]),k=e.useCallback((e=>u(Number(e.target.value),o)),[o,u]),P=l.map((t=>e.createElement("option",{key:t,value:t},t)));R.selectAllRowsItem&&P.push(e.createElement("option",{key:-1,value:n},R.selectAllRowsItemText));const D=e.createElement($e,{onChange:k,defaultValue:t,"aria-label":R.rowsPerPageText},P);return e.createElement(De,{className:"rdt_Pagination"},!R.noRowsPerPage&&h&&e.createElement(e.Fragment,null,e.createElement(Te,null,R.rowsPerPageText),D),h&&e.createElement(Ie,null,v),e.createElement(Fe,null,e.createElement(He,{id:"pagination-first-page",type:"button","aria-label":"First Page","aria-disabled":C,onClick:O,disabled:C,$isRTL:m},i),e.createElement(He,{id:"pagination-previous-page",type:"button","aria-label":"Previous Page","aria-disabled":C,onClick:S,disabled:C,$isRTL:m},d),!R.noRowsPerPage&&!h&&D,e.createElement(He,{id:"pagination-next-page",type:"button","aria-label":"Next Page","aria-disabled":y,onClick:E,disabled:y,$isRTL:m},s),e.createElement(He,{id:"pagination-last-page",type:"button","aria-label":"Last Page","aria-disabled":y,onClick:$,disabled:y,$isRTL:m},r)))}));const Me=(t,n)=>{const o=e.useRef(true);e.useEffect((()=>{o.current?o.current=false:t();}),n);};function Ae(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var _e=function(e){return function(e){return !!e&&"object"==typeof e}(e)&&!function(e){var t=Object.prototype.toString.call(e);return "[object RegExp]"===t||"[object Date]"===t||function(e){return e.$$typeof===Ne}(e)}(e)};var Ne="function"==typeof Symbol&&Symbol.for?Symbol.for("react.element"):60103;function ze(e,t){return  false!==t.clone&&t.isMergeableObject(e)?Ue((n=e,Array.isArray(n)?[]:{}),e,t):e;var n;}function We(e,t,n){return e.concat(t).map((function(e){return ze(e,n)}))}function Be(e){return Object.keys(e).concat(function(e){return Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(e).filter((function(t){return Object.propertyIsEnumerable.call(e,t)})):[]}(e))}function Ge(e,t){try{return t in e}catch(e){return  false}}function Ve(e,t,n){var o={};return n.isMergeableObject(e)&&Be(e).forEach((function(t){o[t]=ze(e[t],n);})),Be(t).forEach((function(a){(function(e,t){return Ge(e,t)&&!(Object.hasOwnProperty.call(e,t)&&Object.propertyIsEnumerable.call(e,t))})(e,a)||(Ge(e,a)&&n.isMergeableObject(t[a])?o[a]=function(e,t){if(!t.customMerge)return Ue;var n=t.customMerge(e);return "function"==typeof n?n:Ue}(a,n)(e[a],t[a],n):o[a]=ze(t[a],n));})),o}function Ue(e,t,n){(n=n||{}).arrayMerge=n.arrayMerge||We,n.isMergeableObject=n.isMergeableObject||_e,n.cloneUnlessOtherwiseSpecified=ze;var o=Array.isArray(t);return o===Array.isArray(e)?o?n.arrayMerge(e,t,n):Ve(e,t,n):ze(t,n)}Ue.all=function(e,t){if(!Array.isArray(e))throw new Error("first argument should be an array");return e.reduce((function(e,n){return Ue(e,n,t)}),{})};var Ye=Ae(Ue);const Ke={text:{primary:"rgba(0, 0, 0, 0.87)",secondary:"rgba(0, 0, 0, 0.54)",disabled:"rgba(0, 0, 0, 0.38)"},background:{default:"#FFFFFF"},context:{background:"#e3f2fd",text:"rgba(0, 0, 0, 0.87)"},divider:{default:"rgba(0,0,0,.12)"},button:{default:"rgba(0,0,0,.54)",focus:"rgba(0,0,0,.12)",hover:"rgba(0,0,0,.12)",disabled:"rgba(0, 0, 0, .18)"},selected:{default:"#e3f2fd",text:"rgba(0, 0, 0, 0.87)"},highlightOnHover:{default:"#EEEEEE",text:"rgba(0, 0, 0, 0.87)"},striped:{default:"#FAFAFA",text:"rgba(0, 0, 0, 0.87)"}},qe={default:Ke,light:Ke,dark:{text:{primary:"#FFFFFF",secondary:"rgba(255, 255, 255, 0.7)",disabled:"rgba(0,0,0,.12)"},background:{default:"#424242"},context:{background:"#E91E63",text:"#FFFFFF"},divider:{default:"rgba(81, 81, 81, 1)"},button:{default:"#FFFFFF",focus:"rgba(255, 255, 255, .54)",hover:"rgba(255, 255, 255, .12)",disabled:"rgba(255, 255, 255, .18)"},selected:{default:"rgba(0, 0, 0, .7)",text:"#FFFFFF"},highlightOnHover:{default:"rgba(0, 0, 0, .7)",text:"#FFFFFF"},striped:{default:"rgba(0, 0, 0, .87)",text:"#FFFFFF"}}};function Qe(t,n,o,a){const[r,i]=e.useState((()=>d(t))),[s,c]=e.useState(""),g=e.useRef("");Me((()=>{i(d(t));}),[t]);const u=e.useCallback((e=>{var t,n,o;const{attributes:a}=e.target,l=null===(t=a.getNamedItem("data-column-id"))||void 0===t?void 0:t.value;l&&(g.current=(null===(o=null===(n=r[m(r,l)])||void 0===n?void 0:n.id)||void 0===o?void 0:o.toString())||"",c(g.current));}),[r]),p=e.useCallback((e=>{var t;const{attributes:o}=e.target,a=null===(t=o.getNamedItem("data-column-id"))||void 0===t?void 0:t.value;if(a&&g.current&&a!==g.current){const e=m(r,g.current),t=m(r,a),o=[...r];o[e]=r[t],o[t]=r[e],i(o),n(o);}}),[n,r]),b=e.useCallback((e=>{e.preventDefault();}),[]),h=e.useCallback((e=>{e.preventDefault();}),[]),w=e.useCallback((e=>{e.preventDefault(),g.current="",c("");}),[]),f=function(e=false){return e?l.ASC:l.DESC}(a),x=e.useMemo((()=>r[m(r,null==o?void 0:o.toString())]||{}),[o,r]);return {tableColumns:r,draggingColumnId:s,handleDragStart:u,handleDragEnter:p,handleDragOver:b,handleDragLeave:h,handleDragEnd:w,defaultSortDirection:f,defaultSortColumn:x}}var Xe=e.memo((function(t){const{data:n=ke.data,columns:o=ke.columns,title:i=ke.title,actions:s=ke.actions,keyField:d=ke.keyField,striped:u=ke.striped,highlightOnHover:p=ke.highlightOnHover,pointerOnHover:m=ke.pointerOnHover,dense:h=ke.dense,selectableRows:f=ke.selectableRows,selectableRowsSingle:C=ke.selectableRowsSingle,selectableRowsHighlight:v=ke.selectableRowsHighlight,selectableRowsNoSelectAll:S=ke.selectableRowsNoSelectAll,selectableRowsVisibleOnly:E=ke.selectableRowsVisibleOnly,selectableRowSelected:O=ke.selectableRowSelected,selectableRowDisabled:k=ke.selectableRowDisabled,selectableRowsComponent:P=ke.selectableRowsComponent,selectableRowsComponentProps:D=ke.selectableRowsComponentProps,onRowExpandToggled:H=ke.onRowExpandToggled,onSelectedRowsChange:F=ke.onSelectedRowsChange,expandableIcon:j=ke.expandableIcon,onChangeRowsPerPage:I=ke.onChangeRowsPerPage,onChangePage:T=ke.onChangePage,paginationServer:L=ke.paginationServer,paginationServerOptions:M=ke.paginationServerOptions,paginationTotalRows:A=ke.paginationTotalRows,paginationDefaultPage:_=ke.paginationDefaultPage,paginationResetDefaultPage:N=ke.paginationResetDefaultPage,paginationPerPage:z=ke.paginationPerPage,paginationRowsPerPageOptions:W=ke.paginationRowsPerPageOptions,paginationIconLastPage:B=ke.paginationIconLastPage,paginationIconFirstPage:G=ke.paginationIconFirstPage,paginationIconNext:V=ke.paginationIconNext,paginationIconPrevious:U=ke.paginationIconPrevious,paginationComponent:Y=ke.paginationComponent,paginationComponentOptions:K=ke.paginationComponentOptions,responsive:J=ke.responsive,progressPending:Q=ke.progressPending,progressComponent:X=ke.progressComponent,persistTableHead:Z=ke.persistTableHead,noDataComponent:ee=ke.noDataComponent,disabled:te=ke.disabled,noTableHead:oe=ke.noTableHead,noHeader:le=ke.noHeader,fixedHeader:re=ke.fixedHeader,fixedHeaderScrollHeight:ie=ke.fixedHeaderScrollHeight,pagination:se=ke.pagination,subHeader:de=ke.subHeader,subHeaderAlign:ce=ke.subHeaderAlign,subHeaderWrap:ge=ke.subHeaderWrap,subHeaderComponent:ue=ke.subHeaderComponent,noContextMenu:be=ke.noContextMenu,contextMessage:me=ke.contextMessage,contextActions:he=ke.contextActions,contextComponent:Se=ke.contextComponent,expandableRows:Ee=ke.expandableRows,onRowClicked:Oe=ke.onRowClicked,onRowDoubleClicked:$e=ke.onRowDoubleClicked,onRowMouseEnter:Pe=ke.onRowMouseEnter,onRowMouseLeave:De=ke.onRowMouseLeave,sortIcon:He=ke.sortIcon,onSort:Fe=ke.onSort,sortFunction:je=ke.sortFunction,sortServer:Ie=ke.sortServer,expandableRowsComponent:Te=ke.expandableRowsComponent,expandableRowsComponentProps:Ae=ke.expandableRowsComponentProps,expandableRowDisabled:_e=ke.expandableRowDisabled,expandableRowsHideExpander:Ne=ke.expandableRowsHideExpander,expandOnRowClicked:ze=ke.expandOnRowClicked,expandOnRowDoubleClicked:We=ke.expandOnRowDoubleClicked,expandableRowExpanded:Be=ke.expandableRowExpanded,expandableInheritConditionalStyles:Ge=ke.expandableInheritConditionalStyles,defaultSortFieldId:Ve=ke.defaultSortFieldId,defaultSortAsc:Ue=ke.defaultSortAsc,clearSelectedRows:Ke=ke.clearSelectedRows,conditionalRowStyles:Je=ke.conditionalRowStyles,theme:Xe=ke.theme,customStyles:Ze=ke.customStyles,direction:et=ke.direction,onColumnOrderChange:tt=ke.onColumnOrderChange,className:nt,ariaLabel:ot$1}=t,{tableColumns:at,draggingColumnId:lt,handleDragStart:rt,handleDragEnter:it,handleDragOver:st,handleDragLeave:dt,handleDragEnd:ct,defaultSortDirection:gt,defaultSortColumn:ut}=Qe(o,tt,Ve,Ue),[{rowsPerPage:pt,currentPage:bt,selectedRows:mt,allSelected:ht,selectedCount:wt,selectedColumn:ft,sortDirection:xt,toggleOnSelectedRowsChange:Ct},yt]=e.useReducer(w,{allSelected:false,selectedCount:0,selectedRows:[],selectedColumn:ut,toggleOnSelectedRowsChange:false,sortDirection:gt,currentPage:_,rowsPerPage:z,selectedRowsFlag:false,contextMessage:ke.contextMessage}),{persistSelectedOnSort:Rt=false,persistSelectedOnPageChange:vt=false}=M,St=!(!L||!vt&&!Rt),Et=se&&!Q&&n.length>0,Ot=Y||Le,$t=e.useMemo((()=>((e={},t="default",n="default")=>{const o=qe[t]?t:n;return Ye({table:{style:{color:(a=qe[o]).text.primary,backgroundColor:a.background.default}},tableWrapper:{style:{display:"table"}},responsiveWrapper:{style:{}},header:{style:{fontSize:"22px",color:a.text.primary,backgroundColor:a.background.default,minHeight:"56px",paddingLeft:"16px",paddingRight:"8px"}},subHeader:{style:{backgroundColor:a.background.default,minHeight:"52px"}},head:{style:{color:a.text.primary,fontSize:"12px",fontWeight:500}},headRow:{style:{backgroundColor:a.background.default,minHeight:"52px",borderBottomWidth:"1px",borderBottomColor:a.divider.default,borderBottomStyle:"solid"},denseStyle:{minHeight:"32px"}},headCells:{style:{paddingLeft:"16px",paddingRight:"16px"},draggingStyle:{cursor:"move"}},contextMenu:{style:{backgroundColor:a.context.background,fontSize:"18px",fontWeight:400,color:a.context.text,paddingLeft:"16px",paddingRight:"8px",transform:"translate3d(0, -100%, 0)",transitionDuration:"125ms",transitionTimingFunction:"cubic-bezier(0, 0, 0.2, 1)",willChange:"transform"},activeStyle:{transform:"translate3d(0, 0, 0)"}},cells:{style:{paddingLeft:"16px",paddingRight:"16px",wordBreak:"break-word"},draggingStyle:{}},rows:{style:{fontSize:"13px",fontWeight:400,color:a.text.primary,backgroundColor:a.background.default,minHeight:"48px","&:not(:last-of-type)":{borderBottomStyle:"solid",borderBottomWidth:"1px",borderBottomColor:a.divider.default}},denseStyle:{minHeight:"32px"},selectedHighlightStyle:{"&:nth-of-type(n)":{color:a.selected.text,backgroundColor:a.selected.default,borderBottomColor:a.background.default}},highlightOnHoverStyle:{color:a.highlightOnHover.text,backgroundColor:a.highlightOnHover.default,transitionDuration:"0.15s",transitionProperty:"background-color",borderBottomColor:a.background.default,outlineStyle:"solid",outlineWidth:"1px",outlineColor:a.background.default},stripedStyle:{color:a.striped.text,backgroundColor:a.striped.default}},expanderRow:{style:{color:a.text.primary,backgroundColor:a.background.default}},expanderCell:{style:{flex:"0 0 48px"}},expanderButton:{style:{color:a.button.default,fill:a.button.default,backgroundColor:"transparent",borderRadius:"2px",transition:"0.25s",height:"100%",width:"100%","&:hover:enabled":{cursor:"pointer"},"&:disabled":{color:a.button.disabled},"&:hover:not(:disabled)":{cursor:"pointer",backgroundColor:a.button.hover},"&:focus":{outline:"none",backgroundColor:a.button.focus},svg:{margin:"auto"}}},pagination:{style:{color:a.text.secondary,fontSize:"13px",minHeight:"56px",backgroundColor:a.background.default,borderTopStyle:"solid",borderTopWidth:"1px",borderTopColor:a.divider.default},pageButtonsStyle:{borderRadius:"50%",height:"40px",width:"40px",padding:"8px",margin:"px",cursor:"pointer",transition:"0.4s",color:a.button.default,fill:a.button.default,backgroundColor:"transparent","&:disabled":{cursor:"unset",color:a.button.disabled,fill:a.button.disabled},"&:hover:not(:disabled)":{backgroundColor:a.button.hover},"&:focus":{outline:"none",backgroundColor:a.button.focus}}},noData:{style:{display:"flex",alignItems:"center",justifyContent:"center",color:a.text.primary,backgroundColor:a.background.default}},progress:{style:{display:"flex",alignItems:"center",justifyContent:"center",color:a.text.primary,backgroundColor:a.background.default}}},e);var a;})(Ze,Xe)),[Ze,Xe]),kt=e.useMemo((()=>Object.assign({},"auto"!==et&&{dir:et})),[et]),Pt=e.useMemo((()=>{if(Ie)return n;if((null==ft?void 0:ft.sortFunction)&&"function"==typeof ft.sortFunction){const e=ft.sortFunction,t=xt===l.ASC?e:(t,n)=>-1*e(t,n);return [...n].sort(t)}return function(e,t,n,o){return t?o&&"function"==typeof o?o(e.slice(0),t,n):e.slice(0).sort(((e,o)=>{const a=t(e),l=t(o);if("asc"===n){if(a<l)return  -1;if(a>l)return 1}if("desc"===n){if(a>l)return  -1;if(a<l)return 1}return 0})):e}(n,null==ft?void 0:ft.selector,xt,je)}),[Ie,ft,xt,n,je]),Dt=e.useMemo((()=>{if(se&&!L){const e=bt*pt,t=e-pt;return Pt.slice(t,e)}return Pt}),[bt,se,L,pt,Pt]),Ht=e.useCallback((e=>{yt(e);}),[]),Ft=e.useCallback((e=>{yt(e);}),[]),jt=e.useCallback((e=>{yt(e);}),[]),It=e.useCallback(((e,t)=>Oe(e,t)),[Oe]),Tt=e.useCallback(((e,t)=>$e(e,t)),[$e]),Lt=e.useCallback(((e,t)=>Pe(e,t)),[Pe]),Mt=e.useCallback(((e,t)=>De(e,t)),[De]),At=e.useCallback((e=>yt({type:"CHANGE_PAGE",page:e,paginationServer:L,visibleOnly:E,persistSelectedOnPageChange:vt})),[L,vt,E]),_t=e.useCallback((e=>{const t=c(A||Dt.length,e),n=g(bt,t);L||At(n),yt({type:"CHANGE_ROWS_PER_PAGE",page:n,rowsPerPage:e});}),[bt,At,L,A,Dt.length]);if(se&&!L&&Pt.length>0&&0===Dt.length){const e=c(Pt.length,pt),t=g(bt,e);At(t);}Me((()=>{F({allSelected:ht,selectedCount:wt,selectedRows:mt.slice(0)});}),[Ct]),Me((()=>{Fe(ft,xt,Pt.slice(0));}),[ft,xt]),Me((()=>{T(bt,A||Pt.length);}),[bt]),Me((()=>{I(pt,bt);}),[pt]),Me((()=>{At(_);}),[_,N]),Me((()=>{if(se&&L&&A>0){const e=c(A,pt),t=g(bt,e);bt!==t&&At(t);}}),[A]),e.useEffect((()=>{yt({type:"CLEAR_SELECTED_ROWS",selectedRowsFlag:Ke});}),[C,Ke]),e.useEffect((()=>{if(!O)return;const e=Pt.filter((e=>O(e))),t=C?e.slice(0,1):e;yt({type:"SELECT_MULTIPLE_ROWS",keyField:d,selectedRows:t,totalRows:Pt.length,mergeSelections:St});}),[n,O]);const Nt=E?Dt:Pt,zt=vt||C||S;return e.createElement(ot,{theme:$t},!le&&(!!i||!!s)&&e.createElement(pe,{title:i,actions:s,showMenu:!be,selectedCount:wt,direction:et,contextActions:he,contextComponent:Se,contextMessage:me}),de&&e.createElement(we,{align:ce,wrapContent:ge},ue),e.createElement(xe,Object.assign({$responsive:J,$fixedHeader:re,$fixedHeaderScrollHeight:ie,className:nt},kt),e.createElement(ye,null,Q&&!Z&&e.createElement(Ce,null,X),e.createElement(x,Object.assign({disabled:te,className:"rdt_Table",role:"table"},ot$1&&{"aria-label":ot$1}),!oe&&(!!Z||Pt.length>0&&!Q)&&e.createElement(y,{className:"rdt_TableHead",role:"rowgroup",$fixedHeader:re},e.createElement(R,{className:"rdt_TableHeadRow",role:"row",$dense:h},f&&(zt?e.createElement($,{style:{flex:"0 0 48px"}}):e.createElement(ae,{allSelected:ht,selectedRows:mt,selectableRowsComponent:P,selectableRowsComponentProps:D,selectableRowDisabled:k,rowData:Nt,keyField:d,mergeSelections:St,onSelectAllRows:Ft})),Ee&&!Ne&&e.createElement(Re,null),at.map((t=>e.createElement(ne,{key:t.id,column:t,selectedColumn:ft,disabled:Q||0===Pt.length,pagination:se,paginationServer:L,persistSelectedOnSort:Rt,selectableRowsVisibleOnly:E,sortDirection:xt,sortIcon:He,sortServer:Ie,onSort:Ht,onDragStart:rt,onDragOver:st,onDragEnd:ct,onDragEnter:it,onDragLeave:dt,draggingColumnId:lt}))))),!Pt.length&&!Q&&e.createElement(ve,null,ee),Q&&Z&&e.createElement(Ce,null,X),!Q&&Pt.length>0&&e.createElement(fe,{className:"rdt_TableBody",role:"rowgroup"},Dt.map(((t,n)=>{const o=r(t,d),a=function(e=""){return "number"!=typeof e&&(!e||0===e.length)}(o)?n:o,l=b(t,mt,d),i=!!(Ee&&Be&&Be(t)),s=!!(Ee&&_e&&_e(t));return e.createElement(q,{id:a,key:a,keyField:d,"data-row-id":a,columns:at,row:t,rowCount:Pt.length,rowIndex:n,selectableRows:f,expandableRows:Ee,expandableIcon:j,highlightOnHover:p,pointerOnHover:m,dense:h,expandOnRowClicked:ze,expandOnRowDoubleClicked:We,expandableRowsComponent:Te,expandableRowsComponentProps:Ae,expandableRowsHideExpander:Ne,defaultExpanderDisabled:s,defaultExpanded:i,expandableInheritConditionalStyles:Ge,conditionalRowStyles:Je,selected:l,selectableRowsHighlight:v,selectableRowsComponent:P,selectableRowsComponentProps:D,selectableRowDisabled:k,selectableRowsSingle:C,striped:u,onRowExpandToggled:H,onRowClicked:It,onRowDoubleClicked:Tt,onRowMouseEnter:Lt,onRowMouseLeave:Mt,onSelectedRow:jt,draggingColumnId:lt,onDragStart:rt,onDragOver:st,onDragEnd:ct,onDragEnter:it,onDragLeave:dt})})))))),Et&&e.createElement("div",null,e.createElement(Ot,{onChangePage:At,onChangeRowsPerPage:_t,rowCount:A||Pt.length,currentPage:bt,rowsPerPage:pt,direction:et,paginationRowsPerPageOptions:W,paginationIconLastPage:B,paginationIconFirstPage:G,paginationIconNext:V,paginationIconPrevious:U,paginationComponentOptions:K})))}));

export { Xe as X };
