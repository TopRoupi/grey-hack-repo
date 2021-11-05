(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[Object.keys(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    __markAsModule(target);
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // node_modules/@rails/actioncable/src/adapters.js
  var adapters_default;
  var init_adapters = __esm({
    "node_modules/@rails/actioncable/src/adapters.js"() {
      adapters_default = {
        logger: self.console,
        WebSocket: self.WebSocket
      };
    }
  });

  // node_modules/@rails/actioncable/src/logger.js
  var logger_default;
  var init_logger = __esm({
    "node_modules/@rails/actioncable/src/logger.js"() {
      init_adapters();
      logger_default = {
        log(...messages) {
          if (this.enabled) {
            messages.push(Date.now());
            adapters_default.logger.log("[ActionCable]", ...messages);
          }
        }
      };
    }
  });

  // node_modules/@rails/actioncable/src/connection_monitor.js
  var now, secondsSince, clamp, ConnectionMonitor, connection_monitor_default;
  var init_connection_monitor = __esm({
    "node_modules/@rails/actioncable/src/connection_monitor.js"() {
      init_logger();
      now = () => new Date().getTime();
      secondsSince = (time) => (now() - time) / 1e3;
      clamp = (number, min, max) => Math.max(min, Math.min(max, number));
      ConnectionMonitor = class {
        constructor(connection) {
          this.visibilityDidChange = this.visibilityDidChange.bind(this);
          this.connection = connection;
          this.reconnectAttempts = 0;
        }
        start() {
          if (!this.isRunning()) {
            this.startedAt = now();
            delete this.stoppedAt;
            this.startPolling();
            addEventListener("visibilitychange", this.visibilityDidChange);
            logger_default.log(`ConnectionMonitor started. pollInterval = ${this.getPollInterval()} ms`);
          }
        }
        stop() {
          if (this.isRunning()) {
            this.stoppedAt = now();
            this.stopPolling();
            removeEventListener("visibilitychange", this.visibilityDidChange);
            logger_default.log("ConnectionMonitor stopped");
          }
        }
        isRunning() {
          return this.startedAt && !this.stoppedAt;
        }
        recordPing() {
          this.pingedAt = now();
        }
        recordConnect() {
          this.reconnectAttempts = 0;
          this.recordPing();
          delete this.disconnectedAt;
          logger_default.log("ConnectionMonitor recorded connect");
        }
        recordDisconnect() {
          this.disconnectedAt = now();
          logger_default.log("ConnectionMonitor recorded disconnect");
        }
        startPolling() {
          this.stopPolling();
          this.poll();
        }
        stopPolling() {
          clearTimeout(this.pollTimeout);
        }
        poll() {
          this.pollTimeout = setTimeout(() => {
            this.reconnectIfStale();
            this.poll();
          }, this.getPollInterval());
        }
        getPollInterval() {
          const { min, max, multiplier } = this.constructor.pollInterval;
          const interval = multiplier * Math.log(this.reconnectAttempts + 1);
          return Math.round(clamp(interval, min, max) * 1e3);
        }
        reconnectIfStale() {
          if (this.connectionIsStale()) {
            logger_default.log(`ConnectionMonitor detected stale connection. reconnectAttempts = ${this.reconnectAttempts}, pollInterval = ${this.getPollInterval()} ms, time disconnected = ${secondsSince(this.disconnectedAt)} s, stale threshold = ${this.constructor.staleThreshold} s`);
            this.reconnectAttempts++;
            if (this.disconnectedRecently()) {
              logger_default.log("ConnectionMonitor skipping reopening recent disconnect");
            } else {
              logger_default.log("ConnectionMonitor reopening");
              this.connection.reopen();
            }
          }
        }
        connectionIsStale() {
          return secondsSince(this.pingedAt ? this.pingedAt : this.startedAt) > this.constructor.staleThreshold;
        }
        disconnectedRecently() {
          return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.constructor.staleThreshold;
        }
        visibilityDidChange() {
          if (document.visibilityState === "visible") {
            setTimeout(() => {
              if (this.connectionIsStale() || !this.connection.isOpen()) {
                logger_default.log(`ConnectionMonitor reopening stale connection on visibilitychange. visibilityState = ${document.visibilityState}`);
                this.connection.reopen();
              }
            }, 200);
          }
        }
      };
      ConnectionMonitor.pollInterval = {
        min: 3,
        max: 30,
        multiplier: 5
      };
      ConnectionMonitor.staleThreshold = 6;
      connection_monitor_default = ConnectionMonitor;
    }
  });

  // node_modules/@rails/actioncable/src/internal.js
  var internal_default;
  var init_internal = __esm({
    "node_modules/@rails/actioncable/src/internal.js"() {
      internal_default = {
        "message_types": {
          "welcome": "welcome",
          "disconnect": "disconnect",
          "ping": "ping",
          "confirmation": "confirm_subscription",
          "rejection": "reject_subscription"
        },
        "disconnect_reasons": {
          "unauthorized": "unauthorized",
          "invalid_request": "invalid_request",
          "server_restart": "server_restart"
        },
        "default_mount_path": "/cable",
        "protocols": [
          "actioncable-v1-json",
          "actioncable-unsupported"
        ]
      };
    }
  });

  // node_modules/@rails/actioncable/src/connection.js
  var message_types, protocols, supportedProtocols, indexOf, Connection, connection_default;
  var init_connection = __esm({
    "node_modules/@rails/actioncable/src/connection.js"() {
      init_adapters();
      init_connection_monitor();
      init_internal();
      init_logger();
      ({ message_types, protocols } = internal_default);
      supportedProtocols = protocols.slice(0, protocols.length - 1);
      indexOf = [].indexOf;
      Connection = class {
        constructor(consumer5) {
          this.open = this.open.bind(this);
          this.consumer = consumer5;
          this.subscriptions = this.consumer.subscriptions;
          this.monitor = new connection_monitor_default(this);
          this.disconnected = true;
        }
        send(data) {
          if (this.isOpen()) {
            this.webSocket.send(JSON.stringify(data));
            return true;
          } else {
            return false;
          }
        }
        open() {
          if (this.isActive()) {
            logger_default.log(`Attempted to open WebSocket, but existing socket is ${this.getState()}`);
            return false;
          } else {
            logger_default.log(`Opening WebSocket, current state is ${this.getState()}, subprotocols: ${protocols}`);
            if (this.webSocket) {
              this.uninstallEventHandlers();
            }
            this.webSocket = new adapters_default.WebSocket(this.consumer.url, protocols);
            this.installEventHandlers();
            this.monitor.start();
            return true;
          }
        }
        close({ allowReconnect } = { allowReconnect: true }) {
          if (!allowReconnect) {
            this.monitor.stop();
          }
          if (this.isActive()) {
            return this.webSocket.close();
          }
        }
        reopen() {
          logger_default.log(`Reopening WebSocket, current state is ${this.getState()}`);
          if (this.isActive()) {
            try {
              return this.close();
            } catch (error4) {
              logger_default.log("Failed to reopen WebSocket", error4);
            } finally {
              logger_default.log(`Reopening WebSocket in ${this.constructor.reopenDelay}ms`);
              setTimeout(this.open, this.constructor.reopenDelay);
            }
          } else {
            return this.open();
          }
        }
        getProtocol() {
          if (this.webSocket) {
            return this.webSocket.protocol;
          }
        }
        isOpen() {
          return this.isState("open");
        }
        isActive() {
          return this.isState("open", "connecting");
        }
        isProtocolSupported() {
          return indexOf.call(supportedProtocols, this.getProtocol()) >= 0;
        }
        isState(...states) {
          return indexOf.call(states, this.getState()) >= 0;
        }
        getState() {
          if (this.webSocket) {
            for (let state in adapters_default.WebSocket) {
              if (adapters_default.WebSocket[state] === this.webSocket.readyState) {
                return state.toLowerCase();
              }
            }
          }
          return null;
        }
        installEventHandlers() {
          for (let eventName in this.events) {
            const handler = this.events[eventName].bind(this);
            this.webSocket[`on${eventName}`] = handler;
          }
        }
        uninstallEventHandlers() {
          for (let eventName in this.events) {
            this.webSocket[`on${eventName}`] = function() {
            };
          }
        }
      };
      Connection.reopenDelay = 500;
      Connection.prototype.events = {
        message(event) {
          if (!this.isProtocolSupported()) {
            return;
          }
          const { identifier, message, reason, reconnect, type } = JSON.parse(event.data);
          switch (type) {
            case message_types.welcome:
              this.monitor.recordConnect();
              return this.subscriptions.reload();
            case message_types.disconnect:
              logger_default.log(`Disconnecting. Reason: ${reason}`);
              return this.close({ allowReconnect: reconnect });
            case message_types.ping:
              return this.monitor.recordPing();
            case message_types.confirmation:
              return this.subscriptions.notify(identifier, "connected");
            case message_types.rejection:
              return this.subscriptions.reject(identifier);
            default:
              return this.subscriptions.notify(identifier, "received", message);
          }
        },
        open() {
          logger_default.log(`WebSocket onopen event, using '${this.getProtocol()}' subprotocol`);
          this.disconnected = false;
          if (!this.isProtocolSupported()) {
            logger_default.log("Protocol is unsupported. Stopping monitor and disconnecting.");
            return this.close({ allowReconnect: false });
          }
        },
        close(event) {
          logger_default.log("WebSocket onclose event");
          if (this.disconnected) {
            return;
          }
          this.disconnected = true;
          this.monitor.recordDisconnect();
          return this.subscriptions.notifyAll("disconnected", { willAttemptReconnect: this.monitor.isRunning() });
        },
        error() {
          logger_default.log("WebSocket onerror event");
        }
      };
      connection_default = Connection;
    }
  });

  // node_modules/@rails/actioncable/src/subscription.js
  var extend, Subscription;
  var init_subscription = __esm({
    "node_modules/@rails/actioncable/src/subscription.js"() {
      extend = function(object, properties) {
        if (properties != null) {
          for (let key in properties) {
            const value = properties[key];
            object[key] = value;
          }
        }
        return object;
      };
      Subscription = class {
        constructor(consumer5, params2 = {}, mixin) {
          this.consumer = consumer5;
          this.identifier = JSON.stringify(params2);
          extend(this, mixin);
        }
        perform(action, data = {}) {
          data.action = action;
          return this.send(data);
        }
        send(data) {
          return this.consumer.send({ command: "message", identifier: this.identifier, data: JSON.stringify(data) });
        }
        unsubscribe() {
          return this.consumer.subscriptions.remove(this);
        }
      };
    }
  });

  // node_modules/@rails/actioncable/src/subscriptions.js
  var Subscriptions;
  var init_subscriptions = __esm({
    "node_modules/@rails/actioncable/src/subscriptions.js"() {
      init_subscription();
      Subscriptions = class {
        constructor(consumer5) {
          this.consumer = consumer5;
          this.subscriptions = [];
        }
        create(channelName, mixin) {
          const channel = channelName;
          const params2 = typeof channel === "object" ? channel : { channel };
          const subscription = new Subscription(this.consumer, params2, mixin);
          return this.add(subscription);
        }
        add(subscription) {
          this.subscriptions.push(subscription);
          this.consumer.ensureActiveConnection();
          this.notify(subscription, "initialized");
          this.sendCommand(subscription, "subscribe");
          return subscription;
        }
        remove(subscription) {
          this.forget(subscription);
          if (!this.findAll(subscription.identifier).length) {
            this.sendCommand(subscription, "unsubscribe");
          }
          return subscription;
        }
        reject(identifier) {
          return this.findAll(identifier).map((subscription) => {
            this.forget(subscription);
            this.notify(subscription, "rejected");
            return subscription;
          });
        }
        forget(subscription) {
          this.subscriptions = this.subscriptions.filter((s2) => s2 !== subscription);
          return subscription;
        }
        findAll(identifier) {
          return this.subscriptions.filter((s2) => s2.identifier === identifier);
        }
        reload() {
          return this.subscriptions.map((subscription) => this.sendCommand(subscription, "subscribe"));
        }
        notifyAll(callbackName, ...args) {
          return this.subscriptions.map((subscription) => this.notify(subscription, callbackName, ...args));
        }
        notify(subscription, callbackName, ...args) {
          let subscriptions;
          if (typeof subscription === "string") {
            subscriptions = this.findAll(subscription);
          } else {
            subscriptions = [subscription];
          }
          return subscriptions.map((subscription2) => typeof subscription2[callbackName] === "function" ? subscription2[callbackName](...args) : void 0);
        }
        sendCommand(subscription, command) {
          const { identifier } = subscription;
          return this.consumer.send({ command, identifier });
        }
      };
    }
  });

  // node_modules/@rails/actioncable/src/consumer.js
  function createWebSocketURL(url2) {
    if (typeof url2 === "function") {
      url2 = url2();
    }
    if (url2 && !/^wss?:/i.test(url2)) {
      const a2 = document.createElement("a");
      a2.href = url2;
      a2.href = a2.href;
      a2.protocol = a2.protocol.replace("http", "ws");
      return a2.href;
    } else {
      return url2;
    }
  }
  var Consumer;
  var init_consumer = __esm({
    "node_modules/@rails/actioncable/src/consumer.js"() {
      init_connection();
      init_subscriptions();
      Consumer = class {
        constructor(url2) {
          this._url = url2;
          this.subscriptions = new Subscriptions(this);
          this.connection = new connection_default(this);
        }
        get url() {
          return createWebSocketURL(this._url);
        }
        send(data) {
          return this.connection.send(data);
        }
        connect() {
          return this.connection.open();
        }
        disconnect() {
          return this.connection.close({ allowReconnect: false });
        }
        ensureActiveConnection() {
          if (!this.connection.isActive()) {
            return this.connection.open();
          }
        }
      };
    }
  });

  // node_modules/@rails/actioncable/src/index.js
  var src_exports = {};
  __export(src_exports, {
    Connection: () => connection_default,
    ConnectionMonitor: () => connection_monitor_default,
    Consumer: () => Consumer,
    INTERNAL: () => internal_default,
    Subscription: () => Subscription,
    Subscriptions: () => Subscriptions,
    adapters: () => adapters_default,
    createConsumer: () => createConsumer,
    createWebSocketURL: () => createWebSocketURL,
    getConfig: () => getConfig,
    logger: () => logger_default
  });
  function createConsumer(url2 = getConfig("url") || internal_default.default_mount_path) {
    return new Consumer(url2);
  }
  function getConfig(name) {
    const element = document.head.querySelector(`meta[name='action-cable-${name}']`);
    if (element) {
      return element.getAttribute("content");
    }
  }
  var init_src = __esm({
    "node_modules/@rails/actioncable/src/index.js"() {
      init_connection();
      init_connection_monitor();
      init_consumer();
      init_internal();
      init_subscription();
      init_subscriptions();
      init_adapters();
      init_logger();
    }
  });

  // node_modules/@rails/activestorage/app/assets/javascripts/activestorage.js
  var require_activestorage = __commonJS({
    "node_modules/@rails/activestorage/app/assets/javascripts/activestorage.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : factory(global.ActiveStorage = {});
      })(exports, function(exports2) {
        "use strict";
        function createCommonjsModule(fn, module2) {
          return module2 = {
            exports: {}
          }, fn(module2, module2.exports), module2.exports;
        }
        var sparkMd5 = createCommonjsModule(function(module2, exports3) {
          (function(factory) {
            {
              module2.exports = factory();
            }
          })(function(undefined2) {
            var hex_chr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
            function md5cycle(x, k) {
              var a2 = x[0], b = x[1], c = x[2], d = x[3];
              a2 += (b & c | ~b & d) + k[0] - 680876936 | 0;
              a2 = (a2 << 7 | a2 >>> 25) + b | 0;
              d += (a2 & b | ~a2 & c) + k[1] - 389564586 | 0;
              d = (d << 12 | d >>> 20) + a2 | 0;
              c += (d & a2 | ~d & b) + k[2] + 606105819 | 0;
              c = (c << 17 | c >>> 15) + d | 0;
              b += (c & d | ~c & a2) + k[3] - 1044525330 | 0;
              b = (b << 22 | b >>> 10) + c | 0;
              a2 += (b & c | ~b & d) + k[4] - 176418897 | 0;
              a2 = (a2 << 7 | a2 >>> 25) + b | 0;
              d += (a2 & b | ~a2 & c) + k[5] + 1200080426 | 0;
              d = (d << 12 | d >>> 20) + a2 | 0;
              c += (d & a2 | ~d & b) + k[6] - 1473231341 | 0;
              c = (c << 17 | c >>> 15) + d | 0;
              b += (c & d | ~c & a2) + k[7] - 45705983 | 0;
              b = (b << 22 | b >>> 10) + c | 0;
              a2 += (b & c | ~b & d) + k[8] + 1770035416 | 0;
              a2 = (a2 << 7 | a2 >>> 25) + b | 0;
              d += (a2 & b | ~a2 & c) + k[9] - 1958414417 | 0;
              d = (d << 12 | d >>> 20) + a2 | 0;
              c += (d & a2 | ~d & b) + k[10] - 42063 | 0;
              c = (c << 17 | c >>> 15) + d | 0;
              b += (c & d | ~c & a2) + k[11] - 1990404162 | 0;
              b = (b << 22 | b >>> 10) + c | 0;
              a2 += (b & c | ~b & d) + k[12] + 1804603682 | 0;
              a2 = (a2 << 7 | a2 >>> 25) + b | 0;
              d += (a2 & b | ~a2 & c) + k[13] - 40341101 | 0;
              d = (d << 12 | d >>> 20) + a2 | 0;
              c += (d & a2 | ~d & b) + k[14] - 1502002290 | 0;
              c = (c << 17 | c >>> 15) + d | 0;
              b += (c & d | ~c & a2) + k[15] + 1236535329 | 0;
              b = (b << 22 | b >>> 10) + c | 0;
              a2 += (b & d | c & ~d) + k[1] - 165796510 | 0;
              a2 = (a2 << 5 | a2 >>> 27) + b | 0;
              d += (a2 & c | b & ~c) + k[6] - 1069501632 | 0;
              d = (d << 9 | d >>> 23) + a2 | 0;
              c += (d & b | a2 & ~b) + k[11] + 643717713 | 0;
              c = (c << 14 | c >>> 18) + d | 0;
              b += (c & a2 | d & ~a2) + k[0] - 373897302 | 0;
              b = (b << 20 | b >>> 12) + c | 0;
              a2 += (b & d | c & ~d) + k[5] - 701558691 | 0;
              a2 = (a2 << 5 | a2 >>> 27) + b | 0;
              d += (a2 & c | b & ~c) + k[10] + 38016083 | 0;
              d = (d << 9 | d >>> 23) + a2 | 0;
              c += (d & b | a2 & ~b) + k[15] - 660478335 | 0;
              c = (c << 14 | c >>> 18) + d | 0;
              b += (c & a2 | d & ~a2) + k[4] - 405537848 | 0;
              b = (b << 20 | b >>> 12) + c | 0;
              a2 += (b & d | c & ~d) + k[9] + 568446438 | 0;
              a2 = (a2 << 5 | a2 >>> 27) + b | 0;
              d += (a2 & c | b & ~c) + k[14] - 1019803690 | 0;
              d = (d << 9 | d >>> 23) + a2 | 0;
              c += (d & b | a2 & ~b) + k[3] - 187363961 | 0;
              c = (c << 14 | c >>> 18) + d | 0;
              b += (c & a2 | d & ~a2) + k[8] + 1163531501 | 0;
              b = (b << 20 | b >>> 12) + c | 0;
              a2 += (b & d | c & ~d) + k[13] - 1444681467 | 0;
              a2 = (a2 << 5 | a2 >>> 27) + b | 0;
              d += (a2 & c | b & ~c) + k[2] - 51403784 | 0;
              d = (d << 9 | d >>> 23) + a2 | 0;
              c += (d & b | a2 & ~b) + k[7] + 1735328473 | 0;
              c = (c << 14 | c >>> 18) + d | 0;
              b += (c & a2 | d & ~a2) + k[12] - 1926607734 | 0;
              b = (b << 20 | b >>> 12) + c | 0;
              a2 += (b ^ c ^ d) + k[5] - 378558 | 0;
              a2 = (a2 << 4 | a2 >>> 28) + b | 0;
              d += (a2 ^ b ^ c) + k[8] - 2022574463 | 0;
              d = (d << 11 | d >>> 21) + a2 | 0;
              c += (d ^ a2 ^ b) + k[11] + 1839030562 | 0;
              c = (c << 16 | c >>> 16) + d | 0;
              b += (c ^ d ^ a2) + k[14] - 35309556 | 0;
              b = (b << 23 | b >>> 9) + c | 0;
              a2 += (b ^ c ^ d) + k[1] - 1530992060 | 0;
              a2 = (a2 << 4 | a2 >>> 28) + b | 0;
              d += (a2 ^ b ^ c) + k[4] + 1272893353 | 0;
              d = (d << 11 | d >>> 21) + a2 | 0;
              c += (d ^ a2 ^ b) + k[7] - 155497632 | 0;
              c = (c << 16 | c >>> 16) + d | 0;
              b += (c ^ d ^ a2) + k[10] - 1094730640 | 0;
              b = (b << 23 | b >>> 9) + c | 0;
              a2 += (b ^ c ^ d) + k[13] + 681279174 | 0;
              a2 = (a2 << 4 | a2 >>> 28) + b | 0;
              d += (a2 ^ b ^ c) + k[0] - 358537222 | 0;
              d = (d << 11 | d >>> 21) + a2 | 0;
              c += (d ^ a2 ^ b) + k[3] - 722521979 | 0;
              c = (c << 16 | c >>> 16) + d | 0;
              b += (c ^ d ^ a2) + k[6] + 76029189 | 0;
              b = (b << 23 | b >>> 9) + c | 0;
              a2 += (b ^ c ^ d) + k[9] - 640364487 | 0;
              a2 = (a2 << 4 | a2 >>> 28) + b | 0;
              d += (a2 ^ b ^ c) + k[12] - 421815835 | 0;
              d = (d << 11 | d >>> 21) + a2 | 0;
              c += (d ^ a2 ^ b) + k[15] + 530742520 | 0;
              c = (c << 16 | c >>> 16) + d | 0;
              b += (c ^ d ^ a2) + k[2] - 995338651 | 0;
              b = (b << 23 | b >>> 9) + c | 0;
              a2 += (c ^ (b | ~d)) + k[0] - 198630844 | 0;
              a2 = (a2 << 6 | a2 >>> 26) + b | 0;
              d += (b ^ (a2 | ~c)) + k[7] + 1126891415 | 0;
              d = (d << 10 | d >>> 22) + a2 | 0;
              c += (a2 ^ (d | ~b)) + k[14] - 1416354905 | 0;
              c = (c << 15 | c >>> 17) + d | 0;
              b += (d ^ (c | ~a2)) + k[5] - 57434055 | 0;
              b = (b << 21 | b >>> 11) + c | 0;
              a2 += (c ^ (b | ~d)) + k[12] + 1700485571 | 0;
              a2 = (a2 << 6 | a2 >>> 26) + b | 0;
              d += (b ^ (a2 | ~c)) + k[3] - 1894986606 | 0;
              d = (d << 10 | d >>> 22) + a2 | 0;
              c += (a2 ^ (d | ~b)) + k[10] - 1051523 | 0;
              c = (c << 15 | c >>> 17) + d | 0;
              b += (d ^ (c | ~a2)) + k[1] - 2054922799 | 0;
              b = (b << 21 | b >>> 11) + c | 0;
              a2 += (c ^ (b | ~d)) + k[8] + 1873313359 | 0;
              a2 = (a2 << 6 | a2 >>> 26) + b | 0;
              d += (b ^ (a2 | ~c)) + k[15] - 30611744 | 0;
              d = (d << 10 | d >>> 22) + a2 | 0;
              c += (a2 ^ (d | ~b)) + k[6] - 1560198380 | 0;
              c = (c << 15 | c >>> 17) + d | 0;
              b += (d ^ (c | ~a2)) + k[13] + 1309151649 | 0;
              b = (b << 21 | b >>> 11) + c | 0;
              a2 += (c ^ (b | ~d)) + k[4] - 145523070 | 0;
              a2 = (a2 << 6 | a2 >>> 26) + b | 0;
              d += (b ^ (a2 | ~c)) + k[11] - 1120210379 | 0;
              d = (d << 10 | d >>> 22) + a2 | 0;
              c += (a2 ^ (d | ~b)) + k[2] + 718787259 | 0;
              c = (c << 15 | c >>> 17) + d | 0;
              b += (d ^ (c | ~a2)) + k[9] - 343485551 | 0;
              b = (b << 21 | b >>> 11) + c | 0;
              x[0] = a2 + x[0] | 0;
              x[1] = b + x[1] | 0;
              x[2] = c + x[2] | 0;
              x[3] = d + x[3] | 0;
            }
            function md5blk(s2) {
              var md5blks = [], i2;
              for (i2 = 0; i2 < 64; i2 += 4) {
                md5blks[i2 >> 2] = s2.charCodeAt(i2) + (s2.charCodeAt(i2 + 1) << 8) + (s2.charCodeAt(i2 + 2) << 16) + (s2.charCodeAt(i2 + 3) << 24);
              }
              return md5blks;
            }
            function md5blk_array(a2) {
              var md5blks = [], i2;
              for (i2 = 0; i2 < 64; i2 += 4) {
                md5blks[i2 >> 2] = a2[i2] + (a2[i2 + 1] << 8) + (a2[i2 + 2] << 16) + (a2[i2 + 3] << 24);
              }
              return md5blks;
            }
            function md51(s2) {
              var n2 = s2.length, state = [1732584193, -271733879, -1732584194, 271733878], i2, length, tail, tmp, lo, hi;
              for (i2 = 64; i2 <= n2; i2 += 64) {
                md5cycle(state, md5blk(s2.substring(i2 - 64, i2)));
              }
              s2 = s2.substring(i2 - 64);
              length = s2.length;
              tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
              for (i2 = 0; i2 < length; i2 += 1) {
                tail[i2 >> 2] |= s2.charCodeAt(i2) << (i2 % 4 << 3);
              }
              tail[i2 >> 2] |= 128 << (i2 % 4 << 3);
              if (i2 > 55) {
                md5cycle(state, tail);
                for (i2 = 0; i2 < 16; i2 += 1) {
                  tail[i2] = 0;
                }
              }
              tmp = n2 * 8;
              tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
              lo = parseInt(tmp[2], 16);
              hi = parseInt(tmp[1], 16) || 0;
              tail[14] = lo;
              tail[15] = hi;
              md5cycle(state, tail);
              return state;
            }
            function md51_array(a2) {
              var n2 = a2.length, state = [1732584193, -271733879, -1732584194, 271733878], i2, length, tail, tmp, lo, hi;
              for (i2 = 64; i2 <= n2; i2 += 64) {
                md5cycle(state, md5blk_array(a2.subarray(i2 - 64, i2)));
              }
              a2 = i2 - 64 < n2 ? a2.subarray(i2 - 64) : new Uint8Array(0);
              length = a2.length;
              tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
              for (i2 = 0; i2 < length; i2 += 1) {
                tail[i2 >> 2] |= a2[i2] << (i2 % 4 << 3);
              }
              tail[i2 >> 2] |= 128 << (i2 % 4 << 3);
              if (i2 > 55) {
                md5cycle(state, tail);
                for (i2 = 0; i2 < 16; i2 += 1) {
                  tail[i2] = 0;
                }
              }
              tmp = n2 * 8;
              tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
              lo = parseInt(tmp[2], 16);
              hi = parseInt(tmp[1], 16) || 0;
              tail[14] = lo;
              tail[15] = hi;
              md5cycle(state, tail);
              return state;
            }
            function rhex(n2) {
              var s2 = "", j;
              for (j = 0; j < 4; j += 1) {
                s2 += hex_chr[n2 >> j * 8 + 4 & 15] + hex_chr[n2 >> j * 8 & 15];
              }
              return s2;
            }
            function hex(x) {
              var i2;
              for (i2 = 0; i2 < x.length; i2 += 1) {
                x[i2] = rhex(x[i2]);
              }
              return x.join("");
            }
            if (hex(md51("hello")) !== "5d41402abc4b2a76b9719d911017c592")
              ;
            if (typeof ArrayBuffer !== "undefined" && !ArrayBuffer.prototype.slice) {
              (function() {
                function clamp2(val, length) {
                  val = val | 0 || 0;
                  if (val < 0) {
                    return Math.max(val + length, 0);
                  }
                  return Math.min(val, length);
                }
                ArrayBuffer.prototype.slice = function(from, to) {
                  var length = this.byteLength, begin = clamp2(from, length), end = length, num, target, targetArray, sourceArray;
                  if (to !== undefined2) {
                    end = clamp2(to, length);
                  }
                  if (begin > end) {
                    return new ArrayBuffer(0);
                  }
                  num = end - begin;
                  target = new ArrayBuffer(num);
                  targetArray = new Uint8Array(target);
                  sourceArray = new Uint8Array(this, begin, num);
                  targetArray.set(sourceArray);
                  return target;
                };
              })();
            }
            function toUtf8(str) {
              if (/[\u0080-\uFFFF]/.test(str)) {
                str = unescape(encodeURIComponent(str));
              }
              return str;
            }
            function utf8Str2ArrayBuffer(str, returnUInt8Array) {
              var length = str.length, buff = new ArrayBuffer(length), arr = new Uint8Array(buff), i2;
              for (i2 = 0; i2 < length; i2 += 1) {
                arr[i2] = str.charCodeAt(i2);
              }
              return returnUInt8Array ? arr : buff;
            }
            function arrayBuffer2Utf8Str(buff) {
              return String.fromCharCode.apply(null, new Uint8Array(buff));
            }
            function concatenateArrayBuffers(first, second, returnUInt8Array) {
              var result = new Uint8Array(first.byteLength + second.byteLength);
              result.set(new Uint8Array(first));
              result.set(new Uint8Array(second), first.byteLength);
              return returnUInt8Array ? result : result.buffer;
            }
            function hexToBinaryString(hex2) {
              var bytes = [], length = hex2.length, x;
              for (x = 0; x < length - 1; x += 2) {
                bytes.push(parseInt(hex2.substr(x, 2), 16));
              }
              return String.fromCharCode.apply(String, bytes);
            }
            function SparkMD5() {
              this.reset();
            }
            SparkMD5.prototype.append = function(str) {
              this.appendBinary(toUtf8(str));
              return this;
            };
            SparkMD5.prototype.appendBinary = function(contents) {
              this._buff += contents;
              this._length += contents.length;
              var length = this._buff.length, i2;
              for (i2 = 64; i2 <= length; i2 += 64) {
                md5cycle(this._hash, md5blk(this._buff.substring(i2 - 64, i2)));
              }
              this._buff = this._buff.substring(i2 - 64);
              return this;
            };
            SparkMD5.prototype.end = function(raw) {
              var buff = this._buff, length = buff.length, i2, tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ret;
              for (i2 = 0; i2 < length; i2 += 1) {
                tail[i2 >> 2] |= buff.charCodeAt(i2) << (i2 % 4 << 3);
              }
              this._finish(tail, length);
              ret = hex(this._hash);
              if (raw) {
                ret = hexToBinaryString(ret);
              }
              this.reset();
              return ret;
            };
            SparkMD5.prototype.reset = function() {
              this._buff = "";
              this._length = 0;
              this._hash = [1732584193, -271733879, -1732584194, 271733878];
              return this;
            };
            SparkMD5.prototype.getState = function() {
              return {
                buff: this._buff,
                length: this._length,
                hash: this._hash
              };
            };
            SparkMD5.prototype.setState = function(state) {
              this._buff = state.buff;
              this._length = state.length;
              this._hash = state.hash;
              return this;
            };
            SparkMD5.prototype.destroy = function() {
              delete this._hash;
              delete this._buff;
              delete this._length;
            };
            SparkMD5.prototype._finish = function(tail, length) {
              var i2 = length, tmp, lo, hi;
              tail[i2 >> 2] |= 128 << (i2 % 4 << 3);
              if (i2 > 55) {
                md5cycle(this._hash, tail);
                for (i2 = 0; i2 < 16; i2 += 1) {
                  tail[i2] = 0;
                }
              }
              tmp = this._length * 8;
              tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
              lo = parseInt(tmp[2], 16);
              hi = parseInt(tmp[1], 16) || 0;
              tail[14] = lo;
              tail[15] = hi;
              md5cycle(this._hash, tail);
            };
            SparkMD5.hash = function(str, raw) {
              return SparkMD5.hashBinary(toUtf8(str), raw);
            };
            SparkMD5.hashBinary = function(content, raw) {
              var hash = md51(content), ret = hex(hash);
              return raw ? hexToBinaryString(ret) : ret;
            };
            SparkMD5.ArrayBuffer = function() {
              this.reset();
            };
            SparkMD5.ArrayBuffer.prototype.append = function(arr) {
              var buff = concatenateArrayBuffers(this._buff.buffer, arr, true), length = buff.length, i2;
              this._length += arr.byteLength;
              for (i2 = 64; i2 <= length; i2 += 64) {
                md5cycle(this._hash, md5blk_array(buff.subarray(i2 - 64, i2)));
              }
              this._buff = i2 - 64 < length ? new Uint8Array(buff.buffer.slice(i2 - 64)) : new Uint8Array(0);
              return this;
            };
            SparkMD5.ArrayBuffer.prototype.end = function(raw) {
              var buff = this._buff, length = buff.length, tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], i2, ret;
              for (i2 = 0; i2 < length; i2 += 1) {
                tail[i2 >> 2] |= buff[i2] << (i2 % 4 << 3);
              }
              this._finish(tail, length);
              ret = hex(this._hash);
              if (raw) {
                ret = hexToBinaryString(ret);
              }
              this.reset();
              return ret;
            };
            SparkMD5.ArrayBuffer.prototype.reset = function() {
              this._buff = new Uint8Array(0);
              this._length = 0;
              this._hash = [1732584193, -271733879, -1732584194, 271733878];
              return this;
            };
            SparkMD5.ArrayBuffer.prototype.getState = function() {
              var state = SparkMD5.prototype.getState.call(this);
              state.buff = arrayBuffer2Utf8Str(state.buff);
              return state;
            };
            SparkMD5.ArrayBuffer.prototype.setState = function(state) {
              state.buff = utf8Str2ArrayBuffer(state.buff, true);
              return SparkMD5.prototype.setState.call(this, state);
            };
            SparkMD5.ArrayBuffer.prototype.destroy = SparkMD5.prototype.destroy;
            SparkMD5.ArrayBuffer.prototype._finish = SparkMD5.prototype._finish;
            SparkMD5.ArrayBuffer.hash = function(arr, raw) {
              var hash = md51_array(new Uint8Array(arr)), ret = hex(hash);
              return raw ? hexToBinaryString(ret) : ret;
            };
            return SparkMD5;
          });
        });
        var classCallCheck = function(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        };
        var createClass = function() {
          function defineProperties(target, props) {
            for (var i2 = 0; i2 < props.length; i2++) {
              var descriptor = props[i2];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor)
                descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          return function(Constructor, protoProps, staticProps) {
            if (protoProps)
              defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
              defineProperties(Constructor, staticProps);
            return Constructor;
          };
        }();
        var fileSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
        var FileChecksum = function() {
          createClass(FileChecksum2, null, [{
            key: "create",
            value: function create(file, callback) {
              var instance = new FileChecksum2(file);
              instance.create(callback);
            }
          }]);
          function FileChecksum2(file) {
            classCallCheck(this, FileChecksum2);
            this.file = file;
            this.chunkSize = 2097152;
            this.chunkCount = Math.ceil(this.file.size / this.chunkSize);
            this.chunkIndex = 0;
          }
          createClass(FileChecksum2, [{
            key: "create",
            value: function create(callback) {
              var _this = this;
              this.callback = callback;
              this.md5Buffer = new sparkMd5.ArrayBuffer();
              this.fileReader = new FileReader();
              this.fileReader.addEventListener("load", function(event) {
                return _this.fileReaderDidLoad(event);
              });
              this.fileReader.addEventListener("error", function(event) {
                return _this.fileReaderDidError(event);
              });
              this.readNextChunk();
            }
          }, {
            key: "fileReaderDidLoad",
            value: function fileReaderDidLoad(event) {
              this.md5Buffer.append(event.target.result);
              if (!this.readNextChunk()) {
                var binaryDigest = this.md5Buffer.end(true);
                var base64digest = btoa(binaryDigest);
                this.callback(null, base64digest);
              }
            }
          }, {
            key: "fileReaderDidError",
            value: function fileReaderDidError(event) {
              this.callback("Error reading " + this.file.name);
            }
          }, {
            key: "readNextChunk",
            value: function readNextChunk() {
              if (this.chunkIndex < this.chunkCount || this.chunkIndex == 0 && this.chunkCount == 0) {
                var start4 = this.chunkIndex * this.chunkSize;
                var end = Math.min(start4 + this.chunkSize, this.file.size);
                var bytes = fileSlice.call(this.file, start4, end);
                this.fileReader.readAsArrayBuffer(bytes);
                this.chunkIndex++;
                return true;
              } else {
                return false;
              }
            }
          }]);
          return FileChecksum2;
        }();
        function getMetaValue(name) {
          var element = findElement(document.head, 'meta[name="' + name + '"]');
          if (element) {
            return element.getAttribute("content");
          }
        }
        function findElements(root, selector) {
          if (typeof root == "string") {
            selector = root;
            root = document;
          }
          var elements = root.querySelectorAll(selector);
          return toArray$1(elements);
        }
        function findElement(root, selector) {
          if (typeof root == "string") {
            selector = root;
            root = document;
          }
          return root.querySelector(selector);
        }
        function dispatchEvent2(element, type) {
          var eventInit = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          var disabled = element.disabled;
          var bubbles = eventInit.bubbles, cancelable = eventInit.cancelable, detail = eventInit.detail;
          var event = document.createEvent("Event");
          event.initEvent(type, bubbles || true, cancelable || true);
          event.detail = detail || {};
          try {
            element.disabled = false;
            element.dispatchEvent(event);
          } finally {
            element.disabled = disabled;
          }
          return event;
        }
        function toArray$1(value) {
          if (Array.isArray(value)) {
            return value;
          } else if (Array.from) {
            return Array.from(value);
          } else {
            return [].slice.call(value);
          }
        }
        var BlobRecord = function() {
          function BlobRecord2(file, checksum, url2) {
            var _this = this;
            classCallCheck(this, BlobRecord2);
            this.file = file;
            this.attributes = {
              filename: file.name,
              content_type: file.type || "application/octet-stream",
              byte_size: file.size,
              checksum
            };
            this.xhr = new XMLHttpRequest();
            this.xhr.open("POST", url2, true);
            this.xhr.responseType = "json";
            this.xhr.setRequestHeader("Content-Type", "application/json");
            this.xhr.setRequestHeader("Accept", "application/json");
            this.xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            var csrfToken = getMetaValue("csrf-token");
            if (csrfToken != void 0) {
              this.xhr.setRequestHeader("X-CSRF-Token", csrfToken);
            }
            this.xhr.addEventListener("load", function(event) {
              return _this.requestDidLoad(event);
            });
            this.xhr.addEventListener("error", function(event) {
              return _this.requestDidError(event);
            });
          }
          createClass(BlobRecord2, [{
            key: "create",
            value: function create(callback) {
              this.callback = callback;
              this.xhr.send(JSON.stringify({
                blob: this.attributes
              }));
            }
          }, {
            key: "requestDidLoad",
            value: function requestDidLoad(event) {
              if (this.status >= 200 && this.status < 300) {
                var response = this.response;
                var direct_upload = response.direct_upload;
                delete response.direct_upload;
                this.attributes = response;
                this.directUploadData = direct_upload;
                this.callback(null, this.toJSON());
              } else {
                this.requestDidError(event);
              }
            }
          }, {
            key: "requestDidError",
            value: function requestDidError(event) {
              this.callback('Error creating Blob for "' + this.file.name + '". Status: ' + this.status);
            }
          }, {
            key: "toJSON",
            value: function toJSON() {
              var result = {};
              for (var key in this.attributes) {
                result[key] = this.attributes[key];
              }
              return result;
            }
          }, {
            key: "status",
            get: function get$$1() {
              return this.xhr.status;
            }
          }, {
            key: "response",
            get: function get$$1() {
              var _xhr = this.xhr, responseType = _xhr.responseType, response = _xhr.response;
              if (responseType == "json") {
                return response;
              } else {
                return JSON.parse(response);
              }
            }
          }]);
          return BlobRecord2;
        }();
        var BlobUpload = function() {
          function BlobUpload2(blob) {
            var _this = this;
            classCallCheck(this, BlobUpload2);
            this.blob = blob;
            this.file = blob.file;
            var _blob$directUploadDat = blob.directUploadData, url2 = _blob$directUploadDat.url, headers = _blob$directUploadDat.headers;
            this.xhr = new XMLHttpRequest();
            this.xhr.open("PUT", url2, true);
            this.xhr.responseType = "text";
            for (var key in headers) {
              this.xhr.setRequestHeader(key, headers[key]);
            }
            this.xhr.addEventListener("load", function(event) {
              return _this.requestDidLoad(event);
            });
            this.xhr.addEventListener("error", function(event) {
              return _this.requestDidError(event);
            });
          }
          createClass(BlobUpload2, [{
            key: "create",
            value: function create(callback) {
              this.callback = callback;
              this.xhr.send(this.file.slice());
            }
          }, {
            key: "requestDidLoad",
            value: function requestDidLoad(event) {
              var _xhr = this.xhr, status = _xhr.status, response = _xhr.response;
              if (status >= 200 && status < 300) {
                this.callback(null, response);
              } else {
                this.requestDidError(event);
              }
            }
          }, {
            key: "requestDidError",
            value: function requestDidError(event) {
              this.callback('Error storing "' + this.file.name + '". Status: ' + this.xhr.status);
            }
          }]);
          return BlobUpload2;
        }();
        var id = 0;
        var DirectUpload2 = function() {
          function DirectUpload3(file, url2, delegate) {
            classCallCheck(this, DirectUpload3);
            this.id = ++id;
            this.file = file;
            this.url = url2;
            this.delegate = delegate;
          }
          createClass(DirectUpload3, [{
            key: "create",
            value: function create(callback) {
              var _this = this;
              FileChecksum.create(this.file, function(error4, checksum) {
                if (error4) {
                  callback(error4);
                  return;
                }
                var blob = new BlobRecord(_this.file, checksum, _this.url);
                notify(_this.delegate, "directUploadWillCreateBlobWithXHR", blob.xhr);
                blob.create(function(error5) {
                  if (error5) {
                    callback(error5);
                  } else {
                    var upload = new BlobUpload(blob);
                    notify(_this.delegate, "directUploadWillStoreFileWithXHR", upload.xhr);
                    upload.create(function(error6) {
                      if (error6) {
                        callback(error6);
                      } else {
                        callback(null, blob.toJSON());
                      }
                    });
                  }
                });
              });
            }
          }]);
          return DirectUpload3;
        }();
        function notify(object, methodName) {
          if (object && typeof object[methodName] == "function") {
            for (var _len = arguments.length, messages = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
              messages[_key - 2] = arguments[_key];
            }
            return object[methodName].apply(object, messages);
          }
        }
        var DirectUploadController = function() {
          function DirectUploadController2(input, file) {
            classCallCheck(this, DirectUploadController2);
            this.input = input;
            this.file = file;
            this.directUpload = new DirectUpload2(this.file, this.url, this);
            this.dispatch("initialize");
          }
          createClass(DirectUploadController2, [{
            key: "start",
            value: function start4(callback) {
              var _this = this;
              var hiddenInput = document.createElement("input");
              hiddenInput.type = "hidden";
              hiddenInput.name = this.input.name;
              this.input.insertAdjacentElement("beforebegin", hiddenInput);
              this.dispatch("start");
              this.directUpload.create(function(error4, attributes) {
                if (error4) {
                  hiddenInput.parentNode.removeChild(hiddenInput);
                  _this.dispatchError(error4);
                } else {
                  hiddenInput.value = attributes.signed_id;
                }
                _this.dispatch("end");
                callback(error4);
              });
            }
          }, {
            key: "uploadRequestDidProgress",
            value: function uploadRequestDidProgress(event) {
              var progress = event.loaded / event.total * 100;
              if (progress) {
                this.dispatch("progress", {
                  progress
                });
              }
            }
          }, {
            key: "dispatch",
            value: function dispatch3(name) {
              var detail = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
              detail.file = this.file;
              detail.id = this.directUpload.id;
              return dispatchEvent2(this.input, "direct-upload:" + name, {
                detail
              });
            }
          }, {
            key: "dispatchError",
            value: function dispatchError(error4) {
              var event = this.dispatch("error", {
                error: error4
              });
              if (!event.defaultPrevented) {
                alert(error4);
              }
            }
          }, {
            key: "directUploadWillCreateBlobWithXHR",
            value: function directUploadWillCreateBlobWithXHR(xhr) {
              this.dispatch("before-blob-request", {
                xhr
              });
            }
          }, {
            key: "directUploadWillStoreFileWithXHR",
            value: function directUploadWillStoreFileWithXHR(xhr) {
              var _this2 = this;
              this.dispatch("before-storage-request", {
                xhr
              });
              xhr.upload.addEventListener("progress", function(event) {
                return _this2.uploadRequestDidProgress(event);
              });
            }
          }, {
            key: "url",
            get: function get$$1() {
              return this.input.getAttribute("data-direct-upload-url");
            }
          }]);
          return DirectUploadController2;
        }();
        var inputSelector = "input[type=file][data-direct-upload-url]:not([disabled])";
        var DirectUploadsController = function() {
          function DirectUploadsController2(form) {
            classCallCheck(this, DirectUploadsController2);
            this.form = form;
            this.inputs = findElements(form, inputSelector).filter(function(input) {
              return input.files.length;
            });
          }
          createClass(DirectUploadsController2, [{
            key: "start",
            value: function start4(callback) {
              var _this = this;
              var controllers = this.createDirectUploadControllers();
              var startNextController = function startNextController2() {
                var controller = controllers.shift();
                if (controller) {
                  controller.start(function(error4) {
                    if (error4) {
                      callback(error4);
                      _this.dispatch("end");
                    } else {
                      startNextController2();
                    }
                  });
                } else {
                  callback();
                  _this.dispatch("end");
                }
              };
              this.dispatch("start");
              startNextController();
            }
          }, {
            key: "createDirectUploadControllers",
            value: function createDirectUploadControllers() {
              var controllers = [];
              this.inputs.forEach(function(input) {
                toArray$1(input.files).forEach(function(file) {
                  var controller = new DirectUploadController(input, file);
                  controllers.push(controller);
                });
              });
              return controllers;
            }
          }, {
            key: "dispatch",
            value: function dispatch3(name) {
              var detail = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
              return dispatchEvent2(this.form, "direct-uploads:" + name, {
                detail
              });
            }
          }]);
          return DirectUploadsController2;
        }();
        var processingAttribute = "data-direct-uploads-processing";
        var submitButtonsByForm = new WeakMap();
        var started = false;
        function start3() {
          if (!started) {
            started = true;
            document.addEventListener("click", didClick, true);
            document.addEventListener("submit", didSubmitForm);
            document.addEventListener("ajax:before", didSubmitRemoteElement);
          }
        }
        function didClick(event) {
          var target = event.target;
          if ((target.tagName == "INPUT" || target.tagName == "BUTTON") && target.type == "submit" && target.form) {
            submitButtonsByForm.set(target.form, target);
          }
        }
        function didSubmitForm(event) {
          handleFormSubmissionEvent(event);
        }
        function didSubmitRemoteElement(event) {
          if (event.target.tagName == "FORM") {
            handleFormSubmissionEvent(event);
          }
        }
        function handleFormSubmissionEvent(event) {
          var form = event.target;
          if (form.hasAttribute(processingAttribute)) {
            event.preventDefault();
            return;
          }
          var controller = new DirectUploadsController(form);
          var inputs = controller.inputs;
          if (inputs.length) {
            event.preventDefault();
            form.setAttribute(processingAttribute, "");
            inputs.forEach(disable);
            controller.start(function(error4) {
              form.removeAttribute(processingAttribute);
              if (error4) {
                inputs.forEach(enable);
              } else {
                submitForm(form);
              }
            });
          }
        }
        function submitForm(form) {
          var button = submitButtonsByForm.get(form) || findElement(form, "input[type=submit], button[type=submit]");
          if (button) {
            var _button = button, disabled = _button.disabled;
            button.disabled = false;
            button.focus();
            button.click();
            button.disabled = disabled;
          } else {
            button = document.createElement("input");
            button.type = "submit";
            button.style.display = "none";
            form.appendChild(button);
            button.click();
            form.removeChild(button);
          }
          submitButtonsByForm.delete(form);
        }
        function disable(input) {
          input.disabled = true;
        }
        function enable(input) {
          input.disabled = false;
        }
        function autostart() {
          if (window.ActiveStorage) {
            start3();
          }
        }
        setTimeout(autostart, 1);
        exports2.start = start3;
        exports2.DirectUpload = DirectUpload2;
        Object.defineProperty(exports2, "__esModule", {
          value: true
        });
      });
    }
  });

  // node_modules/@rails/actioncable/app/assets/javascripts/action_cable.js
  var require_action_cable = __commonJS({
    "node_modules/@rails/actioncable/app/assets/javascripts/action_cable.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : factory(global.ActionCable = {});
      })(exports, function(exports2) {
        "use strict";
        var adapters = {
          logger: self.console,
          WebSocket: self.WebSocket
        };
        var logger = {
          log: function log() {
            if (this.enabled) {
              var _adapters$logger;
              for (var _len = arguments.length, messages = Array(_len), _key = 0; _key < _len; _key++) {
                messages[_key] = arguments[_key];
              }
              messages.push(Date.now());
              (_adapters$logger = adapters.logger).log.apply(_adapters$logger, ["[ActionCable]"].concat(messages));
            }
          }
        };
        var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
          return typeof obj;
        } : function(obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
        var classCallCheck = function(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        };
        var createClass = function() {
          function defineProperties(target, props) {
            for (var i2 = 0; i2 < props.length; i2++) {
              var descriptor = props[i2];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor)
                descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          return function(Constructor, protoProps, staticProps) {
            if (protoProps)
              defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
              defineProperties(Constructor, staticProps);
            return Constructor;
          };
        }();
        var now2 = function now3() {
          return new Date().getTime();
        };
        var secondsSince2 = function secondsSince3(time) {
          return (now2() - time) / 1e3;
        };
        var clamp2 = function clamp3(number, min, max) {
          return Math.max(min, Math.min(max, number));
        };
        var ConnectionMonitor2 = function() {
          function ConnectionMonitor3(connection) {
            classCallCheck(this, ConnectionMonitor3);
            this.visibilityDidChange = this.visibilityDidChange.bind(this);
            this.connection = connection;
            this.reconnectAttempts = 0;
          }
          ConnectionMonitor3.prototype.start = function start3() {
            if (!this.isRunning()) {
              this.startedAt = now2();
              delete this.stoppedAt;
              this.startPolling();
              addEventListener("visibilitychange", this.visibilityDidChange);
              logger.log("ConnectionMonitor started. pollInterval = " + this.getPollInterval() + " ms");
            }
          };
          ConnectionMonitor3.prototype.stop = function stop() {
            if (this.isRunning()) {
              this.stoppedAt = now2();
              this.stopPolling();
              removeEventListener("visibilitychange", this.visibilityDidChange);
              logger.log("ConnectionMonitor stopped");
            }
          };
          ConnectionMonitor3.prototype.isRunning = function isRunning() {
            return this.startedAt && !this.stoppedAt;
          };
          ConnectionMonitor3.prototype.recordPing = function recordPing() {
            this.pingedAt = now2();
          };
          ConnectionMonitor3.prototype.recordConnect = function recordConnect() {
            this.reconnectAttempts = 0;
            this.recordPing();
            delete this.disconnectedAt;
            logger.log("ConnectionMonitor recorded connect");
          };
          ConnectionMonitor3.prototype.recordDisconnect = function recordDisconnect() {
            this.disconnectedAt = now2();
            logger.log("ConnectionMonitor recorded disconnect");
          };
          ConnectionMonitor3.prototype.startPolling = function startPolling() {
            this.stopPolling();
            this.poll();
          };
          ConnectionMonitor3.prototype.stopPolling = function stopPolling() {
            clearTimeout(this.pollTimeout);
          };
          ConnectionMonitor3.prototype.poll = function poll() {
            var _this = this;
            this.pollTimeout = setTimeout(function() {
              _this.reconnectIfStale();
              _this.poll();
            }, this.getPollInterval());
          };
          ConnectionMonitor3.prototype.getPollInterval = function getPollInterval() {
            var _constructor$pollInte = this.constructor.pollInterval, min = _constructor$pollInte.min, max = _constructor$pollInte.max, multiplier = _constructor$pollInte.multiplier;
            var interval = multiplier * Math.log(this.reconnectAttempts + 1);
            return Math.round(clamp2(interval, min, max) * 1e3);
          };
          ConnectionMonitor3.prototype.reconnectIfStale = function reconnectIfStale() {
            if (this.connectionIsStale()) {
              logger.log("ConnectionMonitor detected stale connection. reconnectAttempts = " + this.reconnectAttempts + ", pollInterval = " + this.getPollInterval() + " ms, time disconnected = " + secondsSince2(this.disconnectedAt) + " s, stale threshold = " + this.constructor.staleThreshold + " s");
              this.reconnectAttempts++;
              if (this.disconnectedRecently()) {
                logger.log("ConnectionMonitor skipping reopening recent disconnect");
              } else {
                logger.log("ConnectionMonitor reopening");
                this.connection.reopen();
              }
            }
          };
          ConnectionMonitor3.prototype.connectionIsStale = function connectionIsStale() {
            return secondsSince2(this.pingedAt ? this.pingedAt : this.startedAt) > this.constructor.staleThreshold;
          };
          ConnectionMonitor3.prototype.disconnectedRecently = function disconnectedRecently() {
            return this.disconnectedAt && secondsSince2(this.disconnectedAt) < this.constructor.staleThreshold;
          };
          ConnectionMonitor3.prototype.visibilityDidChange = function visibilityDidChange() {
            var _this2 = this;
            if (document.visibilityState === "visible") {
              setTimeout(function() {
                if (_this2.connectionIsStale() || !_this2.connection.isOpen()) {
                  logger.log("ConnectionMonitor reopening stale connection on visibilitychange. visibilityState = " + document.visibilityState);
                  _this2.connection.reopen();
                }
              }, 200);
            }
          };
          return ConnectionMonitor3;
        }();
        ConnectionMonitor2.pollInterval = {
          min: 3,
          max: 30,
          multiplier: 5
        };
        ConnectionMonitor2.staleThreshold = 6;
        var INTERNAL = {
          message_types: {
            welcome: "welcome",
            disconnect: "disconnect",
            ping: "ping",
            confirmation: "confirm_subscription",
            rejection: "reject_subscription"
          },
          disconnect_reasons: {
            unauthorized: "unauthorized",
            invalid_request: "invalid_request",
            server_restart: "server_restart"
          },
          default_mount_path: "/cable",
          protocols: ["actioncable-v1-json", "actioncable-unsupported"]
        };
        var message_types2 = INTERNAL.message_types, protocols2 = INTERNAL.protocols;
        var supportedProtocols2 = protocols2.slice(0, protocols2.length - 1);
        var indexOf2 = [].indexOf;
        var Connection2 = function() {
          function Connection3(consumer5) {
            classCallCheck(this, Connection3);
            this.open = this.open.bind(this);
            this.consumer = consumer5;
            this.subscriptions = this.consumer.subscriptions;
            this.monitor = new ConnectionMonitor2(this);
            this.disconnected = true;
          }
          Connection3.prototype.send = function send(data) {
            if (this.isOpen()) {
              this.webSocket.send(JSON.stringify(data));
              return true;
            } else {
              return false;
            }
          };
          Connection3.prototype.open = function open() {
            if (this.isActive()) {
              logger.log("Attempted to open WebSocket, but existing socket is " + this.getState());
              return false;
            } else {
              logger.log("Opening WebSocket, current state is " + this.getState() + ", subprotocols: " + protocols2);
              if (this.webSocket) {
                this.uninstallEventHandlers();
              }
              this.webSocket = new adapters.WebSocket(this.consumer.url, protocols2);
              this.installEventHandlers();
              this.monitor.start();
              return true;
            }
          };
          Connection3.prototype.close = function close() {
            var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
              allowReconnect: true
            }, allowReconnect = _ref.allowReconnect;
            if (!allowReconnect) {
              this.monitor.stop();
            }
            if (this.isActive()) {
              return this.webSocket.close();
            }
          };
          Connection3.prototype.reopen = function reopen() {
            logger.log("Reopening WebSocket, current state is " + this.getState());
            if (this.isActive()) {
              try {
                return this.close();
              } catch (error4) {
                logger.log("Failed to reopen WebSocket", error4);
              } finally {
                logger.log("Reopening WebSocket in " + this.constructor.reopenDelay + "ms");
                setTimeout(this.open, this.constructor.reopenDelay);
              }
            } else {
              return this.open();
            }
          };
          Connection3.prototype.getProtocol = function getProtocol() {
            if (this.webSocket) {
              return this.webSocket.protocol;
            }
          };
          Connection3.prototype.isOpen = function isOpen() {
            return this.isState("open");
          };
          Connection3.prototype.isActive = function isActive() {
            return this.isState("open", "connecting");
          };
          Connection3.prototype.isProtocolSupported = function isProtocolSupported() {
            return indexOf2.call(supportedProtocols2, this.getProtocol()) >= 0;
          };
          Connection3.prototype.isState = function isState() {
            for (var _len = arguments.length, states = Array(_len), _key = 0; _key < _len; _key++) {
              states[_key] = arguments[_key];
            }
            return indexOf2.call(states, this.getState()) >= 0;
          };
          Connection3.prototype.getState = function getState() {
            if (this.webSocket) {
              for (var state in adapters.WebSocket) {
                if (adapters.WebSocket[state] === this.webSocket.readyState) {
                  return state.toLowerCase();
                }
              }
            }
            return null;
          };
          Connection3.prototype.installEventHandlers = function installEventHandlers() {
            for (var eventName in this.events) {
              var handler = this.events[eventName].bind(this);
              this.webSocket["on" + eventName] = handler;
            }
          };
          Connection3.prototype.uninstallEventHandlers = function uninstallEventHandlers() {
            for (var eventName in this.events) {
              this.webSocket["on" + eventName] = function() {
              };
            }
          };
          return Connection3;
        }();
        Connection2.reopenDelay = 500;
        Connection2.prototype.events = {
          message: function message(event) {
            if (!this.isProtocolSupported()) {
              return;
            }
            var _JSON$parse = JSON.parse(event.data), identifier = _JSON$parse.identifier, message2 = _JSON$parse.message, reason = _JSON$parse.reason, reconnect = _JSON$parse.reconnect, type = _JSON$parse.type;
            switch (type) {
              case message_types2.welcome:
                this.monitor.recordConnect();
                return this.subscriptions.reload();
              case message_types2.disconnect:
                logger.log("Disconnecting. Reason: " + reason);
                return this.close({
                  allowReconnect: reconnect
                });
              case message_types2.ping:
                return this.monitor.recordPing();
              case message_types2.confirmation:
                return this.subscriptions.notify(identifier, "connected");
              case message_types2.rejection:
                return this.subscriptions.reject(identifier);
              default:
                return this.subscriptions.notify(identifier, "received", message2);
            }
          },
          open: function open() {
            logger.log("WebSocket onopen event, using '" + this.getProtocol() + "' subprotocol");
            this.disconnected = false;
            if (!this.isProtocolSupported()) {
              logger.log("Protocol is unsupported. Stopping monitor and disconnecting.");
              return this.close({
                allowReconnect: false
              });
            }
          },
          close: function close(event) {
            logger.log("WebSocket onclose event");
            if (this.disconnected) {
              return;
            }
            this.disconnected = true;
            this.monitor.recordDisconnect();
            return this.subscriptions.notifyAll("disconnected", {
              willAttemptReconnect: this.monitor.isRunning()
            });
          },
          error: function error4() {
            logger.log("WebSocket onerror event");
          }
        };
        var extend4 = function extend5(object, properties) {
          if (properties != null) {
            for (var key in properties) {
              var value = properties[key];
              object[key] = value;
            }
          }
          return object;
        };
        var Subscription2 = function() {
          function Subscription3(consumer5) {
            var params2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
            var mixin = arguments[2];
            classCallCheck(this, Subscription3);
            this.consumer = consumer5;
            this.identifier = JSON.stringify(params2);
            extend4(this, mixin);
          }
          Subscription3.prototype.perform = function perform2(action) {
            var data = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
            data.action = action;
            return this.send(data);
          };
          Subscription3.prototype.send = function send(data) {
            return this.consumer.send({
              command: "message",
              identifier: this.identifier,
              data: JSON.stringify(data)
            });
          };
          Subscription3.prototype.unsubscribe = function unsubscribe() {
            return this.consumer.subscriptions.remove(this);
          };
          return Subscription3;
        }();
        var Subscriptions2 = function() {
          function Subscriptions3(consumer5) {
            classCallCheck(this, Subscriptions3);
            this.consumer = consumer5;
            this.subscriptions = [];
          }
          Subscriptions3.prototype.create = function create(channelName, mixin) {
            var channel = channelName;
            var params2 = (typeof channel === "undefined" ? "undefined" : _typeof(channel)) === "object" ? channel : {
              channel
            };
            var subscription = new Subscription2(this.consumer, params2, mixin);
            return this.add(subscription);
          };
          Subscriptions3.prototype.add = function add3(subscription) {
            this.subscriptions.push(subscription);
            this.consumer.ensureActiveConnection();
            this.notify(subscription, "initialized");
            this.sendCommand(subscription, "subscribe");
            return subscription;
          };
          Subscriptions3.prototype.remove = function remove(subscription) {
            this.forget(subscription);
            if (!this.findAll(subscription.identifier).length) {
              this.sendCommand(subscription, "unsubscribe");
            }
            return subscription;
          };
          Subscriptions3.prototype.reject = function reject(identifier) {
            var _this = this;
            return this.findAll(identifier).map(function(subscription) {
              _this.forget(subscription);
              _this.notify(subscription, "rejected");
              return subscription;
            });
          };
          Subscriptions3.prototype.forget = function forget(subscription) {
            this.subscriptions = this.subscriptions.filter(function(s2) {
              return s2 !== subscription;
            });
            return subscription;
          };
          Subscriptions3.prototype.findAll = function findAll(identifier) {
            return this.subscriptions.filter(function(s2) {
              return s2.identifier === identifier;
            });
          };
          Subscriptions3.prototype.reload = function reload() {
            var _this2 = this;
            return this.subscriptions.map(function(subscription) {
              return _this2.sendCommand(subscription, "subscribe");
            });
          };
          Subscriptions3.prototype.notifyAll = function notifyAll(callbackName) {
            var _this3 = this;
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              args[_key - 1] = arguments[_key];
            }
            return this.subscriptions.map(function(subscription) {
              return _this3.notify.apply(_this3, [subscription, callbackName].concat(args));
            });
          };
          Subscriptions3.prototype.notify = function notify(subscription, callbackName) {
            for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
              args[_key2 - 2] = arguments[_key2];
            }
            var subscriptions = void 0;
            if (typeof subscription === "string") {
              subscriptions = this.findAll(subscription);
            } else {
              subscriptions = [subscription];
            }
            return subscriptions.map(function(subscription2) {
              return typeof subscription2[callbackName] === "function" ? subscription2[callbackName].apply(subscription2, args) : void 0;
            });
          };
          Subscriptions3.prototype.sendCommand = function sendCommand(subscription, command) {
            var identifier = subscription.identifier;
            return this.consumer.send({
              command,
              identifier
            });
          };
          return Subscriptions3;
        }();
        var Consumer2 = function() {
          function Consumer3(url2) {
            classCallCheck(this, Consumer3);
            this._url = url2;
            this.subscriptions = new Subscriptions2(this);
            this.connection = new Connection2(this);
          }
          Consumer3.prototype.send = function send(data) {
            return this.connection.send(data);
          };
          Consumer3.prototype.connect = function connect() {
            return this.connection.open();
          };
          Consumer3.prototype.disconnect = function disconnect() {
            return this.connection.close({
              allowReconnect: false
            });
          };
          Consumer3.prototype.ensureActiveConnection = function ensureActiveConnection() {
            if (!this.connection.isActive()) {
              return this.connection.open();
            }
          };
          createClass(Consumer3, [{
            key: "url",
            get: function get$$1() {
              return createWebSocketURL2(this._url);
            }
          }]);
          return Consumer3;
        }();
        function createWebSocketURL2(url2) {
          if (typeof url2 === "function") {
            url2 = url2();
          }
          if (url2 && !/^wss?:/i.test(url2)) {
            var a2 = document.createElement("a");
            a2.href = url2;
            a2.href = a2.href;
            a2.protocol = a2.protocol.replace("http", "ws");
            return a2.href;
          } else {
            return url2;
          }
        }
        function createConsumer5() {
          var url2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getConfig2("url") || INTERNAL.default_mount_path;
          return new Consumer2(url2);
        }
        function getConfig2(name) {
          var element = document.head.querySelector("meta[name='action-cable-" + name + "']");
          if (element) {
            return element.getAttribute("content");
          }
        }
        exports2.Connection = Connection2;
        exports2.ConnectionMonitor = ConnectionMonitor2;
        exports2.Consumer = Consumer2;
        exports2.INTERNAL = INTERNAL;
        exports2.Subscription = Subscription2;
        exports2.Subscriptions = Subscriptions2;
        exports2.adapters = adapters;
        exports2.createWebSocketURL = createWebSocketURL2;
        exports2.logger = logger;
        exports2.createConsumer = createConsumer5;
        exports2.getConfig = getConfig2;
        Object.defineProperty(exports2, "__esModule", {
          value: true
        });
      });
    }
  });

  // node_modules/trix/dist/trix.js
  var require_trix = __commonJS({
    "node_modules/trix/dist/trix.js"(exports, module) {
      (function() {
      }).call(exports), function() {
        var t;
        window.Set == null && (window.Set = t = function() {
          function t2() {
            this.clear();
          }
          return t2.prototype.clear = function() {
            return this.values = [];
          }, t2.prototype.has = function(t3) {
            return this.values.indexOf(t3) !== -1;
          }, t2.prototype.add = function(t3) {
            return this.has(t3) || this.values.push(t3), this;
          }, t2.prototype["delete"] = function(t3) {
            var e2;
            return (e2 = this.values.indexOf(t3)) === -1 ? false : (this.values.splice(e2, 1), true);
          }, t2.prototype.forEach = function() {
            var t3;
            return (t3 = this.values).forEach.apply(t3, arguments);
          }, t2;
        }());
      }.call(exports), function(t) {
        function e2() {
        }
        function n2(t2, e3) {
          return function() {
            t2.apply(e3, arguments);
          };
        }
        function i2(t2) {
          if (typeof this != "object")
            throw new TypeError("Promises must be constructed via new");
          if (typeof t2 != "function")
            throw new TypeError("not a function");
          this._state = 0, this._handled = false, this._value = void 0, this._deferreds = [], c(t2, this);
        }
        function o2(t2, e3) {
          for (; t2._state === 3; )
            t2 = t2._value;
          return t2._state === 0 ? void t2._deferreds.push(e3) : (t2._handled = true, void h2(function() {
            var n3 = t2._state === 1 ? e3.onFulfilled : e3.onRejected;
            if (n3 === null)
              return void (t2._state === 1 ? r2 : s2)(e3.promise, t2._value);
            var i3;
            try {
              i3 = n3(t2._value);
            } catch (o3) {
              return void s2(e3.promise, o3);
            }
            r2(e3.promise, i3);
          }));
        }
        function r2(t2, e3) {
          try {
            if (e3 === t2)
              throw new TypeError("A promise cannot be resolved with itself.");
            if (e3 && (typeof e3 == "object" || typeof e3 == "function")) {
              var o3 = e3.then;
              if (e3 instanceof i2)
                return t2._state = 3, t2._value = e3, void a2(t2);
              if (typeof o3 == "function")
                return void c(n2(o3, e3), t2);
            }
            t2._state = 1, t2._value = e3, a2(t2);
          } catch (r3) {
            s2(t2, r3);
          }
        }
        function s2(t2, e3) {
          t2._state = 2, t2._value = e3, a2(t2);
        }
        function a2(t2) {
          t2._state === 2 && t2._deferreds.length === 0 && setTimeout(function() {
            t2._handled || p(t2._value);
          }, 1);
          for (var e3 = 0, n3 = t2._deferreds.length; n3 > e3; e3++)
            o2(t2, t2._deferreds[e3]);
          t2._deferreds = null;
        }
        function u(t2, e3, n3) {
          this.onFulfilled = typeof t2 == "function" ? t2 : null, this.onRejected = typeof e3 == "function" ? e3 : null, this.promise = n3;
        }
        function c(t2, e3) {
          var n3 = false;
          try {
            t2(function(t3) {
              n3 || (n3 = true, r2(e3, t3));
            }, function(t3) {
              n3 || (n3 = true, s2(e3, t3));
            });
          } catch (i3) {
            if (n3)
              return;
            n3 = true, s2(e3, i3);
          }
        }
        var l2 = setTimeout, h2 = typeof setImmediate == "function" && setImmediate || function(t2) {
          l2(t2, 1);
        }, p = function(t2) {
          typeof console != "undefined" && console && console.warn("Possible Unhandled Promise Rejection:", t2);
        };
        i2.prototype["catch"] = function(t2) {
          return this.then(null, t2);
        }, i2.prototype.then = function(t2, n3) {
          var r3 = new i2(e2);
          return o2(this, new u(t2, n3, r3)), r3;
        }, i2.all = function(t2) {
          var e3 = Array.prototype.slice.call(t2);
          return new i2(function(t3, n3) {
            function i3(r4, s3) {
              try {
                if (s3 && (typeof s3 == "object" || typeof s3 == "function")) {
                  var a3 = s3.then;
                  if (typeof a3 == "function")
                    return void a3.call(s3, function(t4) {
                      i3(r4, t4);
                    }, n3);
                }
                e3[r4] = s3, --o3 === 0 && t3(e3);
              } catch (u2) {
                n3(u2);
              }
            }
            if (e3.length === 0)
              return t3([]);
            for (var o3 = e3.length, r3 = 0; r3 < e3.length; r3++)
              i3(r3, e3[r3]);
          });
        }, i2.resolve = function(t2) {
          return t2 && typeof t2 == "object" && t2.constructor === i2 ? t2 : new i2(function(e3) {
            e3(t2);
          });
        }, i2.reject = function(t2) {
          return new i2(function(e3, n3) {
            n3(t2);
          });
        }, i2.race = function(t2) {
          return new i2(function(e3, n3) {
            for (var i3 = 0, o3 = t2.length; o3 > i3; i3++)
              t2[i3].then(e3, n3);
          });
        }, i2._setImmediateFn = function(t2) {
          h2 = t2;
        }, i2._setUnhandledRejectionFn = function(t2) {
          p = t2;
        }, typeof module != "undefined" && module.exports ? module.exports = i2 : t.Promise || (t.Promise = i2);
      }(exports), function() {
        var t = typeof window.customElements == "object", e2 = typeof document.registerElement == "function", n2 = t || e2;
        n2 || (typeof WeakMap == "undefined" && !function() {
          var t2 = Object.defineProperty, e3 = Date.now() % 1e9, n3 = function() {
            this.name = "__st" + (1e9 * Math.random() >>> 0) + (e3++ + "__");
          };
          n3.prototype = { set: function(e4, n4) {
            var i2 = e4[this.name];
            return i2 && i2[0] === e4 ? i2[1] = n4 : t2(e4, this.name, { value: [e4, n4], writable: true }), this;
          }, get: function(t3) {
            var e4;
            return (e4 = t3[this.name]) && e4[0] === t3 ? e4[1] : void 0;
          }, "delete": function(t3) {
            var e4 = t3[this.name];
            return e4 && e4[0] === t3 ? (e4[0] = e4[1] = void 0, true) : false;
          }, has: function(t3) {
            var e4 = t3[this.name];
            return e4 ? e4[0] === t3 : false;
          } }, window.WeakMap = n3;
        }(), function(t2) {
          function e3(t3) {
            A.push(t3), b || (b = true, g(i2));
          }
          function n3(t3) {
            return window.ShadowDOMPolyfill && window.ShadowDOMPolyfill.wrapIfNeeded(t3) || t3;
          }
          function i2() {
            b = false;
            var t3 = A;
            A = [], t3.sort(function(t4, e5) {
              return t4.uid_ - e5.uid_;
            });
            var e4 = false;
            t3.forEach(function(t4) {
              var n4 = t4.takeRecords();
              o2(t4), n4.length && (t4.callback_(n4, t4), e4 = true);
            }), e4 && i2();
          }
          function o2(t3) {
            t3.nodes_.forEach(function(e4) {
              var n4 = m.get(e4);
              n4 && n4.forEach(function(e5) {
                e5.observer === t3 && e5.removeTransientObservers();
              });
            });
          }
          function r2(t3, e4) {
            for (var n4 = t3; n4; n4 = n4.parentNode) {
              var i3 = m.get(n4);
              if (i3)
                for (var o3 = 0; o3 < i3.length; o3++) {
                  var r3 = i3[o3], s3 = r3.options;
                  if (n4 === t3 || s3.subtree) {
                    var a3 = e4(s3);
                    a3 && r3.enqueue(a3);
                  }
                }
            }
          }
          function s2(t3) {
            this.callback_ = t3, this.nodes_ = [], this.records_ = [], this.uid_ = ++C;
          }
          function a2(t3, e4) {
            this.type = t3, this.target = e4, this.addedNodes = [], this.removedNodes = [], this.previousSibling = null, this.nextSibling = null, this.attributeName = null, this.attributeNamespace = null, this.oldValue = null;
          }
          function u(t3) {
            var e4 = new a2(t3.type, t3.target);
            return e4.addedNodes = t3.addedNodes.slice(), e4.removedNodes = t3.removedNodes.slice(), e4.previousSibling = t3.previousSibling, e4.nextSibling = t3.nextSibling, e4.attributeName = t3.attributeName, e4.attributeNamespace = t3.attributeNamespace, e4.oldValue = t3.oldValue, e4;
          }
          function c(t3, e4) {
            return x = new a2(t3, e4);
          }
          function l2(t3) {
            return w ? w : (w = u(x), w.oldValue = t3, w);
          }
          function h2() {
            x = w = void 0;
          }
          function p(t3) {
            return t3 === w || t3 === x;
          }
          function d(t3, e4) {
            return t3 === e4 ? t3 : w && p(t3) ? w : null;
          }
          function f(t3, e4, n4) {
            this.observer = t3, this.target = e4, this.options = n4, this.transientObservedNodes = [];
          }
          if (!t2.JsMutationObserver) {
            var g, m = new WeakMap();
            if (/Trident|Edge/.test(navigator.userAgent))
              g = setTimeout;
            else if (window.setImmediate)
              g = window.setImmediate;
            else {
              var v = [], y = String(Math.random());
              window.addEventListener("message", function(t3) {
                if (t3.data === y) {
                  var e4 = v;
                  v = [], e4.forEach(function(t4) {
                    t4();
                  });
                }
              }), g = function(t3) {
                v.push(t3), window.postMessage(y, "*");
              };
            }
            var b = false, A = [], C = 0;
            s2.prototype = { observe: function(t3, e4) {
              if (t3 = n3(t3), !e4.childList && !e4.attributes && !e4.characterData || e4.attributeOldValue && !e4.attributes || e4.attributeFilter && e4.attributeFilter.length && !e4.attributes || e4.characterDataOldValue && !e4.characterData)
                throw new SyntaxError();
              var i3 = m.get(t3);
              i3 || m.set(t3, i3 = []);
              for (var o3, r3 = 0; r3 < i3.length; r3++)
                if (i3[r3].observer === this) {
                  o3 = i3[r3], o3.removeListeners(), o3.options = e4;
                  break;
                }
              o3 || (o3 = new f(this, t3, e4), i3.push(o3), this.nodes_.push(t3)), o3.addListeners();
            }, disconnect: function() {
              this.nodes_.forEach(function(t3) {
                for (var e4 = m.get(t3), n4 = 0; n4 < e4.length; n4++) {
                  var i3 = e4[n4];
                  if (i3.observer === this) {
                    i3.removeListeners(), e4.splice(n4, 1);
                    break;
                  }
                }
              }, this), this.records_ = [];
            }, takeRecords: function() {
              var t3 = this.records_;
              return this.records_ = [], t3;
            } };
            var x, w;
            f.prototype = { enqueue: function(t3) {
              var n4 = this.observer.records_, i3 = n4.length;
              if (n4.length > 0) {
                var o3 = n4[i3 - 1], r3 = d(o3, t3);
                if (r3)
                  return void (n4[i3 - 1] = r3);
              } else
                e3(this.observer);
              n4[i3] = t3;
            }, addListeners: function() {
              this.addListeners_(this.target);
            }, addListeners_: function(t3) {
              var e4 = this.options;
              e4.attributes && t3.addEventListener("DOMAttrModified", this, true), e4.characterData && t3.addEventListener("DOMCharacterDataModified", this, true), e4.childList && t3.addEventListener("DOMNodeInserted", this, true), (e4.childList || e4.subtree) && t3.addEventListener("DOMNodeRemoved", this, true);
            }, removeListeners: function() {
              this.removeListeners_(this.target);
            }, removeListeners_: function(t3) {
              var e4 = this.options;
              e4.attributes && t3.removeEventListener("DOMAttrModified", this, true), e4.characterData && t3.removeEventListener("DOMCharacterDataModified", this, true), e4.childList && t3.removeEventListener("DOMNodeInserted", this, true), (e4.childList || e4.subtree) && t3.removeEventListener("DOMNodeRemoved", this, true);
            }, addTransientObserver: function(t3) {
              if (t3 !== this.target) {
                this.addListeners_(t3), this.transientObservedNodes.push(t3);
                var e4 = m.get(t3);
                e4 || m.set(t3, e4 = []), e4.push(this);
              }
            }, removeTransientObservers: function() {
              var t3 = this.transientObservedNodes;
              this.transientObservedNodes = [], t3.forEach(function(t4) {
                this.removeListeners_(t4);
                for (var e4 = m.get(t4), n4 = 0; n4 < e4.length; n4++)
                  if (e4[n4] === this) {
                    e4.splice(n4, 1);
                    break;
                  }
              }, this);
            }, handleEvent: function(t3) {
              switch (t3.stopImmediatePropagation(), t3.type) {
                case "DOMAttrModified":
                  var e4 = t3.attrName, n4 = t3.relatedNode.namespaceURI, i3 = t3.target, o3 = new c("attributes", i3);
                  o3.attributeName = e4, o3.attributeNamespace = n4;
                  var s3 = t3.attrChange === MutationEvent.ADDITION ? null : t3.prevValue;
                  r2(i3, function(t4) {
                    return !t4.attributes || t4.attributeFilter && t4.attributeFilter.length && t4.attributeFilter.indexOf(e4) === -1 && t4.attributeFilter.indexOf(n4) === -1 ? void 0 : t4.attributeOldValue ? l2(s3) : o3;
                  });
                  break;
                case "DOMCharacterDataModified":
                  var i3 = t3.target, o3 = c("characterData", i3), s3 = t3.prevValue;
                  r2(i3, function(t4) {
                    return t4.characterData ? t4.characterDataOldValue ? l2(s3) : o3 : void 0;
                  });
                  break;
                case "DOMNodeRemoved":
                  this.addTransientObserver(t3.target);
                case "DOMNodeInserted":
                  var a3, u2, p2 = t3.target;
                  t3.type === "DOMNodeInserted" ? (a3 = [p2], u2 = []) : (a3 = [], u2 = [p2]);
                  var d2 = p2.previousSibling, f2 = p2.nextSibling, o3 = c("childList", t3.target.parentNode);
                  o3.addedNodes = a3, o3.removedNodes = u2, o3.previousSibling = d2, o3.nextSibling = f2, r2(t3.relatedNode, function(t4) {
                    return t4.childList ? o3 : void 0;
                  });
              }
              h2();
            } }, t2.JsMutationObserver = s2, t2.MutationObserver || (t2.MutationObserver = s2, s2._isPolyfilled = true);
          }
        }(self), function() {
          "use strict";
          if (!window.performance || !window.performance.now) {
            var t2 = Date.now();
            window.performance = { now: function() {
              return Date.now() - t2;
            } };
          }
          window.requestAnimationFrame || (window.requestAnimationFrame = function() {
            var t3 = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
            return t3 ? function(e4) {
              return t3(function() {
                e4(performance.now());
              });
            } : function(t4) {
              return window.setTimeout(t4, 1e3 / 60);
            };
          }()), window.cancelAnimationFrame || (window.cancelAnimationFrame = function() {
            return window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || function(t3) {
              clearTimeout(t3);
            };
          }());
          var e3 = function() {
            var t3 = document.createEvent("Event");
            return t3.initEvent("foo", true, true), t3.preventDefault(), t3.defaultPrevented;
          }();
          if (!e3) {
            var n3 = Event.prototype.preventDefault;
            Event.prototype.preventDefault = function() {
              this.cancelable && (n3.call(this), Object.defineProperty(this, "defaultPrevented", { get: function() {
                return true;
              }, configurable: true }));
            };
          }
          var i2 = /Trident/.test(navigator.userAgent);
          if ((!window.CustomEvent || i2 && typeof window.CustomEvent != "function") && (window.CustomEvent = function(t3, e4) {
            e4 = e4 || {};
            var n4 = document.createEvent("CustomEvent");
            return n4.initCustomEvent(t3, Boolean(e4.bubbles), Boolean(e4.cancelable), e4.detail), n4;
          }, window.CustomEvent.prototype = window.Event.prototype), !window.Event || i2 && typeof window.Event != "function") {
            var o2 = window.Event;
            window.Event = function(t3, e4) {
              e4 = e4 || {};
              var n4 = document.createEvent("Event");
              return n4.initEvent(t3, Boolean(e4.bubbles), Boolean(e4.cancelable)), n4;
            }, window.Event.prototype = o2.prototype;
          }
        }(window.WebComponents), window.CustomElements = window.CustomElements || { flags: {} }, function(t2) {
          var e3 = t2.flags, n3 = [], i2 = function(t3) {
            n3.push(t3);
          }, o2 = function() {
            n3.forEach(function(e4) {
              e4(t2);
            });
          };
          t2.addModule = i2, t2.initializeModules = o2, t2.hasNative = Boolean(document.registerElement), t2.isIE = /Trident/.test(navigator.userAgent), t2.useNative = !e3.register && t2.hasNative && !window.ShadowDOMPolyfill && (!window.HTMLImports || window.HTMLImports.useNative);
        }(window.CustomElements), window.CustomElements.addModule(function(t2) {
          function e3(t3, e4) {
            n3(t3, function(t4) {
              return e4(t4) ? true : void i2(t4, e4);
            }), i2(t3, e4);
          }
          function n3(t3, e4, i3) {
            var o3 = t3.firstElementChild;
            if (!o3)
              for (o3 = t3.firstChild; o3 && o3.nodeType !== Node.ELEMENT_NODE; )
                o3 = o3.nextSibling;
            for (; o3; )
              e4(o3, i3) !== true && n3(o3, e4, i3), o3 = o3.nextElementSibling;
            return null;
          }
          function i2(t3, n4) {
            for (var i3 = t3.shadowRoot; i3; )
              e3(i3, n4), i3 = i3.olderShadowRoot;
          }
          function o2(t3, e4) {
            r2(t3, e4, []);
          }
          function r2(t3, e4, n4) {
            if (t3 = window.wrap(t3), !(n4.indexOf(t3) >= 0)) {
              n4.push(t3);
              for (var i3, o3 = t3.querySelectorAll("link[rel=" + s2 + "]"), a2 = 0, u = o3.length; u > a2 && (i3 = o3[a2]); a2++)
                i3.import && r2(i3.import, e4, n4);
              e4(t3);
            }
          }
          var s2 = window.HTMLImports ? window.HTMLImports.IMPORT_LINK_TYPE : "none";
          t2.forDocumentTree = o2, t2.forSubtree = e3;
        }), window.CustomElements.addModule(function(t2) {
          function e3(t3, e4) {
            return n3(t3, e4) || i2(t3, e4);
          }
          function n3(e4, n4) {
            return t2.upgrade(e4, n4) ? true : void (n4 && s2(e4));
          }
          function i2(t3, e4) {
            b(t3, function(t4) {
              return n3(t4, e4) ? true : void 0;
            });
          }
          function o2(t3) {
            w.push(t3), x || (x = true, setTimeout(r2));
          }
          function r2() {
            x = false;
            for (var t3, e4 = w, n4 = 0, i3 = e4.length; i3 > n4 && (t3 = e4[n4]); n4++)
              t3();
            w = [];
          }
          function s2(t3) {
            C ? o2(function() {
              a2(t3);
            }) : a2(t3);
          }
          function a2(t3) {
            t3.__upgraded__ && !t3.__attached && (t3.__attached = true, t3.attachedCallback && t3.attachedCallback());
          }
          function u(t3) {
            c(t3), b(t3, function(t4) {
              c(t4);
            });
          }
          function c(t3) {
            C ? o2(function() {
              l2(t3);
            }) : l2(t3);
          }
          function l2(t3) {
            t3.__upgraded__ && t3.__attached && (t3.__attached = false, t3.detachedCallback && t3.detachedCallback());
          }
          function h2(t3) {
            for (var e4 = t3, n4 = window.wrap(document); e4; ) {
              if (e4 == n4)
                return true;
              e4 = e4.parentNode || e4.nodeType === Node.DOCUMENT_FRAGMENT_NODE && e4.host;
            }
          }
          function p(t3) {
            if (t3.shadowRoot && !t3.shadowRoot.__watched) {
              y.dom && console.log("watching shadow-root for: ", t3.localName);
              for (var e4 = t3.shadowRoot; e4; )
                g(e4), e4 = e4.olderShadowRoot;
            }
          }
          function d(t3, n4) {
            if (y.dom) {
              var i3 = n4[0];
              if (i3 && i3.type === "childList" && i3.addedNodes && i3.addedNodes) {
                for (var o3 = i3.addedNodes[0]; o3 && o3 !== document && !o3.host; )
                  o3 = o3.parentNode;
                var r3 = o3 && (o3.URL || o3._URL || o3.host && o3.host.localName) || "";
                r3 = r3.split("/?").shift().split("/").pop();
              }
              console.group("mutations (%d) [%s]", n4.length, r3 || "");
            }
            var s3 = h2(t3);
            n4.forEach(function(t4) {
              t4.type === "childList" && (E(t4.addedNodes, function(t5) {
                t5.localName && e3(t5, s3);
              }), E(t4.removedNodes, function(t5) {
                t5.localName && u(t5);
              }));
            }), y.dom && console.groupEnd();
          }
          function f(t3) {
            for (t3 = window.wrap(t3), t3 || (t3 = window.wrap(document)); t3.parentNode; )
              t3 = t3.parentNode;
            var e4 = t3.__observer;
            e4 && (d(t3, e4.takeRecords()), r2());
          }
          function g(t3) {
            if (!t3.__observer) {
              var e4 = new MutationObserver(d.bind(this, t3));
              e4.observe(t3, { childList: true, subtree: true }), t3.__observer = e4;
            }
          }
          function m(t3) {
            t3 = window.wrap(t3), y.dom && console.group("upgradeDocument: ", t3.baseURI.split("/").pop());
            var n4 = t3 === window.wrap(document);
            e3(t3, n4), g(t3), y.dom && console.groupEnd();
          }
          function v(t3) {
            A(t3, m);
          }
          var y = t2.flags, b = t2.forSubtree, A = t2.forDocumentTree, C = window.MutationObserver._isPolyfilled && y["throttle-attached"];
          t2.hasPolyfillMutations = C, t2.hasThrottledAttached = C;
          var x = false, w = [], E = Array.prototype.forEach.call.bind(Array.prototype.forEach), S = Element.prototype.createShadowRoot;
          S && (Element.prototype.createShadowRoot = function() {
            var t3 = S.call(this);
            return window.CustomElements.watchShadow(this), t3;
          }), t2.watchShadow = p, t2.upgradeDocumentTree = v, t2.upgradeDocument = m, t2.upgradeSubtree = i2, t2.upgradeAll = e3, t2.attached = s2, t2.takeRecords = f;
        }), window.CustomElements.addModule(function(t2) {
          function e3(e4, i3) {
            if (e4.localName === "template" && window.HTMLTemplateElement && HTMLTemplateElement.decorate && HTMLTemplateElement.decorate(e4), !e4.__upgraded__ && e4.nodeType === Node.ELEMENT_NODE) {
              var o3 = e4.getAttribute("is"), r3 = t2.getRegisteredDefinition(e4.localName) || t2.getRegisteredDefinition(o3);
              if (r3 && (o3 && r3.tag == e4.localName || !o3 && !r3.extends))
                return n3(e4, r3, i3);
            }
          }
          function n3(e4, n4, o3) {
            return s2.upgrade && console.group("upgrade:", e4.localName), n4.is && e4.setAttribute("is", n4.is), i2(e4, n4), e4.__upgraded__ = true, r2(e4), o3 && t2.attached(e4), t2.upgradeSubtree(e4, o3), s2.upgrade && console.groupEnd(), e4;
          }
          function i2(t3, e4) {
            Object.__proto__ ? t3.__proto__ = e4.prototype : (o2(t3, e4.prototype, e4.native), t3.__proto__ = e4.prototype);
          }
          function o2(t3, e4, n4) {
            for (var i3 = {}, o3 = e4; o3 !== n4 && o3 !== HTMLElement.prototype; ) {
              for (var r3, s3 = Object.getOwnPropertyNames(o3), a2 = 0; r3 = s3[a2]; a2++)
                i3[r3] || (Object.defineProperty(t3, r3, Object.getOwnPropertyDescriptor(o3, r3)), i3[r3] = 1);
              o3 = Object.getPrototypeOf(o3);
            }
          }
          function r2(t3) {
            t3.createdCallback && t3.createdCallback();
          }
          var s2 = t2.flags;
          t2.upgrade = e3, t2.upgradeWithDefinition = n3, t2.implementPrototype = i2;
        }), window.CustomElements.addModule(function(t2) {
          function e3(e4, i3) {
            var u2 = i3 || {};
            if (!e4)
              throw new Error("document.registerElement: first argument `name` must not be empty");
            if (e4.indexOf("-") < 0)
              throw new Error("document.registerElement: first argument ('name') must contain a dash ('-'). Argument provided was '" + String(e4) + "'.");
            if (o2(e4))
              throw new Error("Failed to execute 'registerElement' on 'Document': Registration failed for type '" + String(e4) + "'. The type name is invalid.");
            if (c(e4))
              throw new Error("DuplicateDefinitionError: a type with name '" + String(e4) + "' is already registered");
            return u2.prototype || (u2.prototype = Object.create(HTMLElement.prototype)), u2.__name = e4.toLowerCase(), u2.extends && (u2.extends = u2.extends.toLowerCase()), u2.lifecycle = u2.lifecycle || {}, u2.ancestry = r2(u2.extends), s2(u2), a2(u2), n3(u2.prototype), l2(u2.__name, u2), u2.ctor = h2(u2), u2.ctor.prototype = u2.prototype, u2.prototype.constructor = u2.ctor, t2.ready && m(document), u2.ctor;
          }
          function n3(t3) {
            if (!t3.setAttribute._polyfilled) {
              var e4 = t3.setAttribute;
              t3.setAttribute = function(t4, n5) {
                i2.call(this, t4, n5, e4);
              };
              var n4 = t3.removeAttribute;
              t3.removeAttribute = function(t4) {
                i2.call(this, t4, null, n4);
              }, t3.setAttribute._polyfilled = true;
            }
          }
          function i2(t3, e4, n4) {
            t3 = t3.toLowerCase();
            var i3 = this.getAttribute(t3);
            n4.apply(this, arguments);
            var o3 = this.getAttribute(t3);
            this.attributeChangedCallback && o3 !== i3 && this.attributeChangedCallback(t3, i3, o3);
          }
          function o2(t3) {
            for (var e4 = 0; e4 < C.length; e4++)
              if (t3 === C[e4])
                return true;
          }
          function r2(t3) {
            var e4 = c(t3);
            return e4 ? r2(e4.extends).concat([e4]) : [];
          }
          function s2(t3) {
            for (var e4, n4 = t3.extends, i3 = 0; e4 = t3.ancestry[i3]; i3++)
              n4 = e4.is && e4.tag;
            t3.tag = n4 || t3.__name, n4 && (t3.is = t3.__name);
          }
          function a2(t3) {
            if (!Object.__proto__) {
              var e4 = HTMLElement.prototype;
              if (t3.is) {
                var n4 = document.createElement(t3.tag);
                e4 = Object.getPrototypeOf(n4);
              }
              for (var i3, o3 = t3.prototype, r3 = false; o3; )
                o3 == e4 && (r3 = true), i3 = Object.getPrototypeOf(o3), i3 && (o3.__proto__ = i3), o3 = i3;
              r3 || console.warn(t3.tag + " prototype not found in prototype chain for " + t3.is), t3.native = e4;
            }
          }
          function u(t3) {
            return y(E(t3.tag), t3);
          }
          function c(t3) {
            return t3 ? x[t3.toLowerCase()] : void 0;
          }
          function l2(t3, e4) {
            x[t3] = e4;
          }
          function h2(t3) {
            return function() {
              return u(t3);
            };
          }
          function p(t3, e4, n4) {
            return t3 === w ? d(e4, n4) : S(t3, e4);
          }
          function d(t3, e4) {
            t3 && (t3 = t3.toLowerCase()), e4 && (e4 = e4.toLowerCase());
            var n4 = c(e4 || t3);
            if (n4) {
              if (t3 == n4.tag && e4 == n4.is)
                return new n4.ctor();
              if (!e4 && !n4.is)
                return new n4.ctor();
            }
            var i3;
            return e4 ? (i3 = d(t3), i3.setAttribute("is", e4), i3) : (i3 = E(t3), t3.indexOf("-") >= 0 && b(i3, HTMLElement), i3);
          }
          function f(t3, e4) {
            var n4 = t3[e4];
            t3[e4] = function() {
              var t4 = n4.apply(this, arguments);
              return v(t4), t4;
            };
          }
          var g, m = (t2.isIE, t2.upgradeDocumentTree), v = t2.upgradeAll, y = t2.upgradeWithDefinition, b = t2.implementPrototype, A = t2.useNative, C = ["annotation-xml", "color-profile", "font-face", "font-face-src", "font-face-uri", "font-face-format", "font-face-name", "missing-glyph"], x = {}, w = "http://www.w3.org/1999/xhtml", E = document.createElement.bind(document), S = document.createElementNS.bind(document);
          g = Object.__proto__ || A ? function(t3, e4) {
            return t3 instanceof e4;
          } : function(t3, e4) {
            if (t3 instanceof e4)
              return true;
            for (var n4 = t3; n4; ) {
              if (n4 === e4.prototype)
                return true;
              n4 = n4.__proto__;
            }
            return false;
          }, f(Node.prototype, "cloneNode"), f(document, "importNode"), document.registerElement = e3, document.createElement = d, document.createElementNS = p, t2.registry = x, t2.instanceof = g, t2.reservedTagList = C, t2.getRegisteredDefinition = c, document.register = document.registerElement;
        }), function(t2) {
          function e3() {
            r2(window.wrap(document)), window.CustomElements.ready = true;
            var t3 = window.requestAnimationFrame || function(t4) {
              setTimeout(t4, 16);
            };
            t3(function() {
              setTimeout(function() {
                window.CustomElements.readyTime = Date.now(), window.HTMLImports && (window.CustomElements.elapsed = window.CustomElements.readyTime - window.HTMLImports.readyTime), document.dispatchEvent(new CustomEvent("WebComponentsReady", { bubbles: true }));
              });
            });
          }
          var n3 = t2.useNative, i2 = t2.initializeModules;
          if (t2.isIE, n3) {
            var o2 = function() {
            };
            t2.watchShadow = o2, t2.upgrade = o2, t2.upgradeAll = o2, t2.upgradeDocumentTree = o2, t2.upgradeSubtree = o2, t2.takeRecords = o2, t2.instanceof = function(t3, e4) {
              return t3 instanceof e4;
            };
          } else
            i2();
          var r2 = t2.upgradeDocumentTree, s2 = t2.upgradeDocument;
          if (window.wrap || (window.ShadowDOMPolyfill ? (window.wrap = window.ShadowDOMPolyfill.wrapIfNeeded, window.unwrap = window.ShadowDOMPolyfill.unwrapIfNeeded) : window.wrap = window.unwrap = function(t3) {
            return t3;
          }), window.HTMLImports && (window.HTMLImports.__importsParsingHook = function(t3) {
            t3.import && s2(wrap(t3.import));
          }), document.readyState === "complete" || t2.flags.eager)
            e3();
          else if (document.readyState !== "interactive" || window.attachEvent || window.HTMLImports && !window.HTMLImports.ready) {
            var a2 = window.HTMLImports && !window.HTMLImports.ready ? "HTMLImportsLoaded" : "DOMContentLoaded";
            window.addEventListener(a2, e3);
          } else
            e3();
        }(window.CustomElements));
      }.call(exports), function() {
      }.call(exports), function() {
        var t = this;
        (function() {
          (function() {
            this.Trix = { VERSION: "1.3.1", ZERO_WIDTH_SPACE: "\uFEFF", NON_BREAKING_SPACE: "\xA0", OBJECT_REPLACEMENT_CHARACTER: "\uFFFC", browser: { composesExistingText: /Android.*Chrome/.test(navigator.userAgent), forcesObjectResizing: /Trident.*rv:11/.test(navigator.userAgent), supportsInputEvents: function() {
              var t2, e3, n2, i2;
              if (typeof InputEvent == "undefined")
                return false;
              for (i2 = ["data", "getTargetRanges", "inputType"], t2 = 0, e3 = i2.length; e3 > t2; t2++)
                if (n2 = i2[t2], !(n2 in InputEvent.prototype))
                  return false;
              return true;
            }() }, config: {} };
          }).call(this);
        }).call(t);
        var e2 = t.Trix;
        (function() {
          (function() {
            e2.BasicObject = function() {
              function t2() {
              }
              var e3, n2, i2;
              return t2.proxyMethod = function(t3) {
                var i3, o2, r2, s2, a2;
                return r2 = n2(t3), i3 = r2.name, s2 = r2.toMethod, a2 = r2.toProperty, o2 = r2.optional, this.prototype[i3] = function() {
                  var t4, n3;
                  return t4 = s2 != null ? o2 ? typeof this[s2] == "function" ? this[s2]() : void 0 : this[s2]() : a2 != null ? this[a2] : void 0, o2 ? (n3 = t4 != null ? t4[i3] : void 0, n3 != null ? e3.call(n3, t4, arguments) : void 0) : (n3 = t4[i3], e3.call(n3, t4, arguments));
                };
              }, n2 = function(t3) {
                var e4, n3;
                if (!(n3 = t3.match(i2)))
                  throw new Error("can't parse @proxyMethod expression: " + t3);
                return e4 = { name: n3[4] }, n3[2] != null ? e4.toMethod = n3[1] : e4.toProperty = n3[1], n3[3] != null && (e4.optional = true), e4;
              }, e3 = Function.prototype.apply, i2 = /^(.+?)(\(\))?(\?)?\.(.+?)$/, t2;
            }();
          }).call(this), function() {
            var t2 = function(t3, e3) {
              function i2() {
                this.constructor = t3;
              }
              for (var o2 in e3)
                n2.call(e3, o2) && (t3[o2] = e3[o2]);
              return i2.prototype = e3.prototype, t3.prototype = new i2(), t3.__super__ = e3.prototype, t3;
            }, n2 = {}.hasOwnProperty;
            e2.Object = function(n3) {
              function i2() {
                this.id = ++o2;
              }
              var o2;
              return t2(i2, n3), o2 = 0, i2.fromJSONString = function(t3) {
                return this.fromJSON(JSON.parse(t3));
              }, i2.prototype.hasSameConstructorAs = function(t3) {
                return this.constructor === (t3 != null ? t3.constructor : void 0);
              }, i2.prototype.isEqualTo = function(t3) {
                return this === t3;
              }, i2.prototype.inspect = function() {
                var t3, e3, n4;
                return t3 = function() {
                  var t4, i3, o3;
                  i3 = (t4 = this.contentsForInspection()) != null ? t4 : {}, o3 = [];
                  for (e3 in i3)
                    n4 = i3[e3], o3.push(e3 + "=" + n4);
                  return o3;
                }.call(this), "#<" + this.constructor.name + ":" + this.id + (t3.length ? " " + t3.join(", ") : "") + ">";
              }, i2.prototype.contentsForInspection = function() {
              }, i2.prototype.toJSONString = function() {
                return JSON.stringify(this);
              }, i2.prototype.toUTF16String = function() {
                return e2.UTF16String.box(this);
              }, i2.prototype.getCacheKey = function() {
                return this.id.toString();
              }, i2;
            }(e2.BasicObject);
          }.call(this), function() {
            e2.extend = function(t2) {
              var e3, n2;
              for (e3 in t2)
                n2 = t2[e3], this[e3] = n2;
              return this;
            };
          }.call(this), function() {
            e2.extend({ defer: function(t2) {
              return setTimeout(t2, 1);
            } });
          }.call(this), function() {
            var t2, n2;
            e2.extend({ normalizeSpaces: function(t3) {
              return t3.replace(RegExp("" + e2.ZERO_WIDTH_SPACE, "g"), "").replace(RegExp("" + e2.NON_BREAKING_SPACE, "g"), " ");
            }, normalizeNewlines: function(t3) {
              return t3.replace(/\r\n/g, "\n");
            }, breakableWhitespacePattern: RegExp("[^\\S" + e2.NON_BREAKING_SPACE + "]"), squishBreakableWhitespace: function(t3) {
              return t3.replace(RegExp("" + e2.breakableWhitespacePattern.source, "g"), " ").replace(/\ {2,}/g, " ");
            }, summarizeStringChange: function(t3, i2) {
              var o2, r2, s2, a2;
              return t3 = e2.UTF16String.box(t3), i2 = e2.UTF16String.box(i2), i2.length < t3.length ? (r2 = n2(t3, i2), a2 = r2[0], o2 = r2[1]) : (s2 = n2(i2, t3), o2 = s2[0], a2 = s2[1]), { added: o2, removed: a2 };
            } }), n2 = function(n3, i2) {
              var o2, r2, s2, a2, u;
              return n3.isEqualTo(i2) ? ["", ""] : (r2 = t2(n3, i2), a2 = r2.utf16String.length, s2 = a2 ? (u = r2.offset, r2, o2 = n3.codepoints.slice(0, u).concat(n3.codepoints.slice(u + a2)), t2(i2, e2.UTF16String.fromCodepoints(o2))) : t2(i2, n3), [r2.utf16String.toString(), s2.utf16String.toString()]);
            }, t2 = function(t3, e3) {
              var n3, i2, o2;
              for (n3 = 0, i2 = t3.length, o2 = e3.length; i2 > n3 && t3.charAt(n3).isEqualTo(e3.charAt(n3)); )
                n3++;
              for (; i2 > n3 + 1 && t3.charAt(i2 - 1).isEqualTo(e3.charAt(o2 - 1)); )
                i2--, o2--;
              return { utf16String: t3.slice(n3, i2), offset: n3 };
            };
          }.call(this), function() {
            e2.extend({ copyObject: function(t2) {
              var e3, n2, i2;
              t2 == null && (t2 = {}), n2 = {};
              for (e3 in t2)
                i2 = t2[e3], n2[e3] = i2;
              return n2;
            }, objectsAreEqual: function(t2, e3) {
              var n2, i2;
              if (t2 == null && (t2 = {}), e3 == null && (e3 = {}), Object.keys(t2).length !== Object.keys(e3).length)
                return false;
              for (n2 in t2)
                if (i2 = t2[n2], i2 !== e3[n2])
                  return false;
              return true;
            } });
          }.call(this), function() {
            var t2 = [].slice;
            e2.extend({ arraysAreEqual: function(t3, e3) {
              var n2, i2, o2, r2;
              if (t3 == null && (t3 = []), e3 == null && (e3 = []), t3.length !== e3.length)
                return false;
              for (i2 = n2 = 0, o2 = t3.length; o2 > n2; i2 = ++n2)
                if (r2 = t3[i2], r2 !== e3[i2])
                  return false;
              return true;
            }, arrayStartsWith: function(t3, n2) {
              return t3 == null && (t3 = []), n2 == null && (n2 = []), e2.arraysAreEqual(t3.slice(0, n2.length), n2);
            }, spliceArray: function() {
              var e3, n2, i2;
              return n2 = arguments[0], e3 = 2 <= arguments.length ? t2.call(arguments, 1) : [], i2 = n2.slice(0), i2.splice.apply(i2, e3), i2;
            }, summarizeArrayChange: function(t3, e3) {
              var n2, i2, o2, r2, s2, a2, u, c, l2, h2, p;
              for (t3 == null && (t3 = []), e3 == null && (e3 = []), n2 = [], h2 = [], o2 = new Set(), r2 = 0, u = t3.length; u > r2; r2++)
                p = t3[r2], o2.add(p);
              for (i2 = new Set(), s2 = 0, c = e3.length; c > s2; s2++)
                p = e3[s2], i2.add(p), o2.has(p) || n2.push(p);
              for (a2 = 0, l2 = t3.length; l2 > a2; a2++)
                p = t3[a2], i2.has(p) || h2.push(p);
              return { added: n2, removed: h2 };
            } });
          }.call(this), function() {
            var t2, n2, i2, o2;
            t2 = null, n2 = null, o2 = null, i2 = null, e2.extend({ getAllAttributeNames: function() {
              return t2 != null ? t2 : t2 = e2.getTextAttributeNames().concat(e2.getBlockAttributeNames());
            }, getBlockConfig: function(t3) {
              return e2.config.blockAttributes[t3];
            }, getBlockAttributeNames: function() {
              return n2 != null ? n2 : n2 = Object.keys(e2.config.blockAttributes);
            }, getTextConfig: function(t3) {
              return e2.config.textAttributes[t3];
            }, getTextAttributeNames: function() {
              return o2 != null ? o2 : o2 = Object.keys(e2.config.textAttributes);
            }, getListAttributeNames: function() {
              var t3, n3;
              return i2 != null ? i2 : i2 = function() {
                var i3, o3;
                i3 = e2.config.blockAttributes, o3 = [];
                for (t3 in i3)
                  n3 = i3[t3].listAttribute, n3 != null && o3.push(n3);
                return o3;
              }();
            } });
          }.call(this), function() {
            var t2, n2, i2, o2, r2, s2 = [].indexOf || function(t3) {
              for (var e3 = 0, n3 = this.length; n3 > e3; e3++)
                if (e3 in this && this[e3] === t3)
                  return e3;
              return -1;
            };
            t2 = document.documentElement, n2 = (i2 = (o2 = (r2 = t2.matchesSelector) != null ? r2 : t2.webkitMatchesSelector) != null ? o2 : t2.msMatchesSelector) != null ? i2 : t2.mozMatchesSelector, e2.extend({ handleEvent: function(n3, i3) {
              var o3, r3, s3, a2, u, c, l2, h2, p, d, f, g;
              return h2 = i3 != null ? i3 : {}, c = h2.onElement, u = h2.matchingSelector, g = h2.withCallback, a2 = h2.inPhase, l2 = h2.preventDefault, d = h2.times, r3 = c != null ? c : t2, p = u, o3 = g, f = a2 === "capturing", s3 = function(t3) {
                var n4;
                return d != null && --d === 0 && s3.destroy(), n4 = e2.findClosestElementFromNode(t3.target, { matchingSelector: p }), n4 != null && (g != null && g.call(n4, t3, n4), l2) ? t3.preventDefault() : void 0;
              }, s3.destroy = function() {
                return r3.removeEventListener(n3, s3, f);
              }, r3.addEventListener(n3, s3, f), s3;
            }, handleEventOnce: function(t3, n3) {
              return n3 == null && (n3 = {}), n3.times = 1, e2.handleEvent(t3, n3);
            }, triggerEvent: function(n3, i3) {
              var o3, r3, s3, a2, u, c, l2;
              return l2 = i3 != null ? i3 : {}, c = l2.onElement, r3 = l2.bubbles, s3 = l2.cancelable, o3 = l2.attributes, a2 = c != null ? c : t2, r3 = r3 !== false, s3 = s3 !== false, u = document.createEvent("Events"), u.initEvent(n3, r3, s3), o3 != null && e2.extend.call(u, o3), a2.dispatchEvent(u);
            }, elementMatchesSelector: function(t3, e3) {
              return (t3 != null ? t3.nodeType : void 0) === 1 ? n2.call(t3, e3) : void 0;
            }, findClosestElementFromNode: function(t3, n3) {
              var i3, o3, r3;
              for (o3 = n3 != null ? n3 : {}, i3 = o3.matchingSelector, r3 = o3.untilNode; t3 != null && t3.nodeType !== Node.ELEMENT_NODE; )
                t3 = t3.parentNode;
              if (t3 != null) {
                if (i3 == null)
                  return t3;
                if (t3.closest && r3 == null)
                  return t3.closest(i3);
                for (; t3 && t3 !== r3; ) {
                  if (e2.elementMatchesSelector(t3, i3))
                    return t3;
                  t3 = t3.parentNode;
                }
              }
            }, findInnerElement: function(t3) {
              for (; t3 != null ? t3.firstElementChild : void 0; )
                t3 = t3.firstElementChild;
              return t3;
            }, innerElementIsActive: function(t3) {
              return document.activeElement !== t3 && e2.elementContainsNode(t3, document.activeElement);
            }, elementContainsNode: function(t3, e3) {
              if (t3 && e3)
                for (; e3; ) {
                  if (e3 === t3)
                    return true;
                  e3 = e3.parentNode;
                }
            }, findNodeFromContainerAndOffset: function(t3, e3) {
              var n3;
              if (t3)
                return t3.nodeType === Node.TEXT_NODE ? t3 : e3 === 0 ? (n3 = t3.firstChild) != null ? n3 : t3 : t3.childNodes.item(e3 - 1);
            }, findElementFromContainerAndOffset: function(t3, n3) {
              var i3;
              return i3 = e2.findNodeFromContainerAndOffset(t3, n3), e2.findClosestElementFromNode(i3);
            }, findChildIndexOfNode: function(t3) {
              var e3;
              if (t3 != null ? t3.parentNode : void 0) {
                for (e3 = 0; t3 = t3.previousSibling; )
                  e3++;
                return e3;
              }
            }, removeNode: function(t3) {
              var e3;
              return t3 != null && (e3 = t3.parentNode) != null ? e3.removeChild(t3) : void 0;
            }, walkTree: function(t3, e3) {
              var n3, i3, o3, r3, s3;
              return o3 = e3 != null ? e3 : {}, i3 = o3.onlyNodesOfType, r3 = o3.usingFilter, n3 = o3.expandEntityReferences, s3 = function() {
                switch (i3) {
                  case "element":
                    return NodeFilter.SHOW_ELEMENT;
                  case "text":
                    return NodeFilter.SHOW_TEXT;
                  case "comment":
                    return NodeFilter.SHOW_COMMENT;
                  default:
                    return NodeFilter.SHOW_ALL;
                }
              }(), document.createTreeWalker(t3, s3, r3 != null ? r3 : null, n3 === true);
            }, tagName: function(t3) {
              var e3;
              return t3 != null && (e3 = t3.tagName) != null ? e3.toLowerCase() : void 0;
            }, makeElement: function(t3, e3) {
              var n3, i3, o3, r3, s3, a2, u, c, l2, h2, p, d, f, g;
              if (e3 == null && (e3 = {}), typeof t3 == "object" ? (e3 = t3, t3 = e3.tagName) : e3 = { attributes: e3 }, o3 = document.createElement(t3), e3.editable != null && (e3.attributes == null && (e3.attributes = {}), e3.attributes.contenteditable = e3.editable), e3.attributes) {
                l2 = e3.attributes;
                for (a2 in l2)
                  g = l2[a2], o3.setAttribute(a2, g);
              }
              if (e3.style) {
                h2 = e3.style;
                for (a2 in h2)
                  g = h2[a2], o3.style[a2] = g;
              }
              if (e3.data) {
                p = e3.data;
                for (a2 in p)
                  g = p[a2], o3.dataset[a2] = g;
              }
              if (e3.className)
                for (d = e3.className.split(" "), r3 = 0, u = d.length; u > r3; r3++)
                  i3 = d[r3], o3.classList.add(i3);
              if (e3.textContent && (o3.textContent = e3.textContent), e3.childNodes)
                for (f = [].concat(e3.childNodes), s3 = 0, c = f.length; c > s3; s3++)
                  n3 = f[s3], o3.appendChild(n3);
              return o3;
            }, getBlockTagNames: function() {
              var t3, n3;
              return e2.blockTagNames != null ? e2.blockTagNames : e2.blockTagNames = function() {
                var i3, o3;
                i3 = e2.config.blockAttributes, o3 = [];
                for (t3 in i3)
                  n3 = i3[t3].tagName, n3 && o3.push(n3);
                return o3;
              }();
            }, nodeIsBlockContainer: function(t3) {
              return e2.nodeIsBlockStartComment(t3 != null ? t3.firstChild : void 0);
            }, nodeProbablyIsBlockContainer: function(t3) {
              var n3, i3;
              return n3 = e2.tagName(t3), s2.call(e2.getBlockTagNames(), n3) >= 0 && (i3 = e2.tagName(t3.firstChild), s2.call(e2.getBlockTagNames(), i3) < 0);
            }, nodeIsBlockStart: function(t3, n3) {
              var i3;
              return i3 = (n3 != null ? n3 : { strict: true }).strict, i3 ? e2.nodeIsBlockStartComment(t3) : e2.nodeIsBlockStartComment(t3) || !e2.nodeIsBlockStartComment(t3.firstChild) && e2.nodeProbablyIsBlockContainer(t3);
            }, nodeIsBlockStartComment: function(t3) {
              return e2.nodeIsCommentNode(t3) && (t3 != null ? t3.data : void 0) === "block";
            }, nodeIsCommentNode: function(t3) {
              return (t3 != null ? t3.nodeType : void 0) === Node.COMMENT_NODE;
            }, nodeIsCursorTarget: function(t3, n3) {
              var i3;
              return i3 = (n3 != null ? n3 : {}).name, t3 ? e2.nodeIsTextNode(t3) ? t3.data === e2.ZERO_WIDTH_SPACE ? i3 ? t3.parentNode.dataset.trixCursorTarget === i3 : true : void 0 : e2.nodeIsCursorTarget(t3.firstChild) : void 0;
            }, nodeIsAttachmentElement: function(t3) {
              return e2.elementMatchesSelector(t3, e2.AttachmentView.attachmentSelector);
            }, nodeIsEmptyTextNode: function(t3) {
              return e2.nodeIsTextNode(t3) && (t3 != null ? t3.data : void 0) === "";
            }, nodeIsTextNode: function(t3) {
              return (t3 != null ? t3.nodeType : void 0) === Node.TEXT_NODE;
            } });
          }.call(this), function() {
            var t2, n2, i2, o2, r2;
            t2 = e2.copyObject, o2 = e2.objectsAreEqual, e2.extend({ normalizeRange: i2 = function(t3) {
              var e3;
              if (t3 != null)
                return Array.isArray(t3) || (t3 = [t3, t3]), [n2(t3[0]), n2((e3 = t3[1]) != null ? e3 : t3[0])];
            }, rangeIsCollapsed: function(t3) {
              var e3, n3, o3;
              if (t3 != null)
                return n3 = i2(t3), o3 = n3[0], e3 = n3[1], r2(o3, e3);
            }, rangesAreEqual: function(t3, e3) {
              var n3, o3, s2, a2, u, c;
              if (t3 != null && e3 != null)
                return s2 = i2(t3), o3 = s2[0], n3 = s2[1], a2 = i2(e3), c = a2[0], u = a2[1], r2(o3, c) && r2(n3, u);
            } }), n2 = function(e3) {
              return typeof e3 == "number" ? e3 : t2(e3);
            }, r2 = function(t3, e3) {
              return typeof t3 == "number" ? t3 === e3 : o2(t3, e3);
            };
          }.call(this), function() {
            var t2, n2, i2, o2, r2, s2, a2;
            e2.registerElement = function(t3, e3) {
              var n3, i3;
              return e3 == null && (e3 = {}), t3 = t3.toLowerCase(), e3 = a2(e3), i3 = s2(e3), (n3 = i3.defaultCSS) && (delete i3.defaultCSS, o2(n3, t3)), r2(t3, i3);
            }, o2 = function(t3, e3) {
              var n3;
              return n3 = i2(e3), n3.textContent = t3.replace(/%t/g, e3);
            }, i2 = function(e3) {
              var n3, i3;
              return n3 = document.createElement("style"), n3.setAttribute("type", "text/css"), n3.setAttribute("data-tag-name", e3.toLowerCase()), (i3 = t2()) && n3.setAttribute("nonce", i3), document.head.insertBefore(n3, document.head.firstChild), n3;
            }, t2 = function() {
              var t3;
              return (t3 = n2("trix-csp-nonce") || n2("csp-nonce")) ? t3.getAttribute("content") : void 0;
            }, n2 = function(t3) {
              return document.head.querySelector("meta[name=" + t3 + "]");
            }, s2 = function(t3) {
              var e3, n3, i3;
              n3 = {};
              for (e3 in t3)
                i3 = t3[e3], n3[e3] = typeof i3 == "function" ? { value: i3 } : i3;
              return n3;
            }, a2 = function() {
              var t3;
              return t3 = function(t4) {
                var e3, n3, i3, o3, r3;
                for (e3 = {}, r3 = ["initialize", "connect", "disconnect"], n3 = 0, o3 = r3.length; o3 > n3; n3++)
                  i3 = r3[n3], e3[i3] = t4[i3], delete t4[i3];
                return e3;
              }, window.customElements ? function(e3) {
                var n3, i3, o3, r3, s3;
                return s3 = t3(e3), o3 = s3.initialize, n3 = s3.connect, i3 = s3.disconnect, o3 && (r3 = n3, n3 = function() {
                  return this.initialized || (this.initialized = true, o3.call(this)), r3 != null ? r3.call(this) : void 0;
                }), n3 && (e3.connectedCallback = n3), i3 && (e3.disconnectedCallback = i3), e3;
              } : function(e3) {
                var n3, i3, o3, r3;
                return r3 = t3(e3), o3 = r3.initialize, n3 = r3.connect, i3 = r3.disconnect, o3 && (e3.createdCallback = o3), n3 && (e3.attachedCallback = n3), i3 && (e3.detachedCallback = i3), e3;
              };
            }(), r2 = function() {
              return window.customElements ? function(t3, e3) {
                var n3;
                return n3 = function() {
                  return typeof Reflect == "object" ? Reflect.construct(HTMLElement, [], n3) : HTMLElement.apply(this);
                }, Object.setPrototypeOf(n3.prototype, HTMLElement.prototype), Object.setPrototypeOf(n3, HTMLElement), Object.defineProperties(n3.prototype, e3), window.customElements.define(t3, n3), n3;
              } : function(t3, e3) {
                var n3, i3;
                return i3 = Object.create(HTMLElement.prototype, e3), n3 = document.registerElement(t3, { prototype: i3 }), Object.defineProperty(i3, "constructor", { value: n3 }), n3;
              };
            }();
          }.call(this), function() {
            var t2, n2;
            e2.extend({ getDOMSelection: function() {
              var t3;
              return t3 = window.getSelection(), t3.rangeCount > 0 ? t3 : void 0;
            }, getDOMRange: function() {
              var n3, i2;
              return (n3 = (i2 = e2.getDOMSelection()) != null ? i2.getRangeAt(0) : void 0) && !t2(n3) ? n3 : void 0;
            }, setDOMRange: function(t3) {
              var n3;
              return n3 = window.getSelection(), n3.removeAllRanges(), n3.addRange(t3), e2.selectionChangeObserver.update();
            } }), t2 = function(t3) {
              return n2(t3.startContainer) || n2(t3.endContainer);
            }, n2 = function(t3) {
              return !Object.getPrototypeOf(t3);
            };
          }.call(this), function() {
            var t2;
            t2 = { "application/x-trix-feature-detection": "test" }, e2.extend({ dataTransferIsPlainText: function(t3) {
              var e3, n2, i2;
              return i2 = t3.getData("text/plain"), n2 = t3.getData("text/html"), i2 && n2 ? (e3 = new DOMParser().parseFromString(n2, "text/html").body, e3.textContent === i2 ? !e3.querySelector("*") : void 0) : i2 != null ? i2.length : void 0;
            }, dataTransferIsWritable: function(e3) {
              var n2, i2;
              if ((e3 != null ? e3.setData : void 0) != null) {
                for (n2 in t2)
                  if (i2 = t2[n2], !function() {
                    try {
                      return e3.setData(n2, i2), e3.getData(n2) === i2;
                    } catch (t3) {
                    }
                  }())
                    return;
                return true;
              }
            }, keyEventIsKeyboardCommand: function() {
              return /Mac|^iP/.test(navigator.platform) ? function(t3) {
                return t3.metaKey;
              } : function(t3) {
                return t3.ctrlKey;
              };
            }() });
          }.call(this), function() {
            e2.extend({ RTL_PATTERN: /[\u05BE\u05C0\u05C3\u05D0-\u05EA\u05F0-\u05F4\u061B\u061F\u0621-\u063A\u0640-\u064A\u066D\u0671-\u06B7\u06BA-\u06BE\u06C0-\u06CE\u06D0-\u06D5\u06E5\u06E6\u200F\u202B\u202E\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE72\uFE74\uFE76-\uFEFC]/, getDirection: function() {
              var t2, n2, i2, o2;
              return n2 = e2.makeElement("input", { dir: "auto", name: "x", dirName: "x.dir" }), t2 = e2.makeElement("form"), t2.appendChild(n2), i2 = function() {
                try {
                  return new FormData(t2).has(n2.dirName);
                } catch (e3) {
                }
              }(), o2 = function() {
                try {
                  return n2.matches(":dir(ltr),:dir(rtl)");
                } catch (t3) {
                }
              }(), i2 ? function(e3) {
                return n2.value = e3, new FormData(t2).get(n2.dirName);
              } : o2 ? function(t3) {
                return n2.value = t3, n2.matches(":dir(rtl)") ? "rtl" : "ltr";
              } : function(t3) {
                var n3;
                return n3 = t3.trim().charAt(0), e2.RTL_PATTERN.test(n3) ? "rtl" : "ltr";
              };
            }() });
          }.call(this), function() {
          }.call(this), function() {
            var t2, n2 = function(t3, e3) {
              function n3() {
                this.constructor = t3;
              }
              for (var o2 in e3)
                i2.call(e3, o2) && (t3[o2] = e3[o2]);
              return n3.prototype = e3.prototype, t3.prototype = new n3(), t3.__super__ = e3.prototype, t3;
            }, i2 = {}.hasOwnProperty;
            t2 = e2.arraysAreEqual, e2.Hash = function(i3) {
              function o2(t3) {
                t3 == null && (t3 = {}), this.values = s2(t3), o2.__super__.constructor.apply(this, arguments);
              }
              var r2, s2, a2, u, c;
              return n2(o2, i3), o2.fromCommonAttributesOfObjects = function(t3) {
                var e3, n3, i4, o3, s3, a3;
                if (t3 == null && (t3 = []), !t3.length)
                  return new this();
                for (e3 = r2(t3[0]), i4 = e3.getKeys(), a3 = t3.slice(1), n3 = 0, o3 = a3.length; o3 > n3; n3++)
                  s3 = a3[n3], i4 = e3.getKeysCommonToHash(r2(s3)), e3 = e3.slice(i4);
                return e3;
              }, o2.box = function(t3) {
                return r2(t3);
              }, o2.prototype.add = function(t3, e3) {
                return this.merge(u(t3, e3));
              }, o2.prototype.remove = function(t3) {
                return new e2.Hash(s2(this.values, t3));
              }, o2.prototype.get = function(t3) {
                return this.values[t3];
              }, o2.prototype.has = function(t3) {
                return t3 in this.values;
              }, o2.prototype.merge = function(t3) {
                return new e2.Hash(a2(this.values, c(t3)));
              }, o2.prototype.slice = function(t3) {
                var n3, i4, o3, r3;
                for (r3 = {}, n3 = 0, o3 = t3.length; o3 > n3; n3++)
                  i4 = t3[n3], this.has(i4) && (r3[i4] = this.values[i4]);
                return new e2.Hash(r3);
              }, o2.prototype.getKeys = function() {
                return Object.keys(this.values);
              }, o2.prototype.getKeysCommonToHash = function(t3) {
                var e3, n3, i4, o3, s3;
                for (t3 = r2(t3), o3 = this.getKeys(), s3 = [], e3 = 0, i4 = o3.length; i4 > e3; e3++)
                  n3 = o3[e3], this.values[n3] === t3.values[n3] && s3.push(n3);
                return s3;
              }, o2.prototype.isEqualTo = function(e3) {
                return t2(this.toArray(), r2(e3).toArray());
              }, o2.prototype.isEmpty = function() {
                return this.getKeys().length === 0;
              }, o2.prototype.toArray = function() {
                var t3, e3, n3;
                return (this.array != null ? this.array : this.array = function() {
                  var i4;
                  e3 = [], i4 = this.values;
                  for (t3 in i4)
                    n3 = i4[t3], e3.push(t3, n3);
                  return e3;
                }.call(this)).slice(0);
              }, o2.prototype.toObject = function() {
                return s2(this.values);
              }, o2.prototype.toJSON = function() {
                return this.toObject();
              }, o2.prototype.contentsForInspection = function() {
                return { values: JSON.stringify(this.values) };
              }, u = function(t3, e3) {
                var n3;
                return n3 = {}, n3[t3] = e3, n3;
              }, a2 = function(t3, e3) {
                var n3, i4, o3;
                i4 = s2(t3);
                for (n3 in e3)
                  o3 = e3[n3], i4[n3] = o3;
                return i4;
              }, s2 = function(t3, e3) {
                var n3, i4, o3, r3, s3;
                for (r3 = {}, s3 = Object.keys(t3).sort(), n3 = 0, o3 = s3.length; o3 > n3; n3++)
                  i4 = s3[n3], i4 !== e3 && (r3[i4] = t3[i4]);
                return r3;
              }, r2 = function(t3) {
                return t3 instanceof e2.Hash ? t3 : new e2.Hash(t3);
              }, c = function(t3) {
                return t3 instanceof e2.Hash ? t3.values : t3;
              }, o2;
            }(e2.Object);
          }.call(this), function() {
            e2.ObjectGroup = function() {
              function t2(t3, e3) {
                var n2, i2;
                this.objects = t3 != null ? t3 : [], i2 = e3.depth, n2 = e3.asTree, n2 && (this.depth = i2, this.objects = this.constructor.groupObjects(this.objects, { asTree: n2, depth: this.depth + 1 }));
              }
              return t2.groupObjects = function(t3, e3) {
                var n2, i2, o2, r2, s2, a2, u, c, l2;
                for (t3 == null && (t3 = []), l2 = e3 != null ? e3 : {}, o2 = l2.depth, n2 = l2.asTree, n2 && o2 == null && (o2 = 0), c = [], s2 = 0, a2 = t3.length; a2 > s2; s2++) {
                  if (u = t3[s2], r2) {
                    if ((typeof u.canBeGrouped == "function" ? u.canBeGrouped(o2) : void 0) && (typeof (i2 = r2[r2.length - 1]).canBeGroupedWith == "function" ? i2.canBeGroupedWith(u, o2) : void 0)) {
                      r2.push(u);
                      continue;
                    }
                    c.push(new this(r2, { depth: o2, asTree: n2 })), r2 = null;
                  }
                  (typeof u.canBeGrouped == "function" ? u.canBeGrouped(o2) : void 0) ? r2 = [u] : c.push(u);
                }
                return r2 && c.push(new this(r2, { depth: o2, asTree: n2 })), c;
              }, t2.prototype.getObjects = function() {
                return this.objects;
              }, t2.prototype.getDepth = function() {
                return this.depth;
              }, t2.prototype.getCacheKey = function() {
                var t3, e3, n2, i2, o2;
                for (e3 = ["objectGroup"], o2 = this.getObjects(), t3 = 0, n2 = o2.length; n2 > t3; t3++)
                  i2 = o2[t3], e3.push(i2.getCacheKey());
                return e3.join("/");
              }, t2;
            }();
          }.call(this), function() {
            var t2 = function(t3, e3) {
              function i2() {
                this.constructor = t3;
              }
              for (var o2 in e3)
                n2.call(e3, o2) && (t3[o2] = e3[o2]);
              return i2.prototype = e3.prototype, t3.prototype = new i2(), t3.__super__ = e3.prototype, t3;
            }, n2 = {}.hasOwnProperty;
            e2.ObjectMap = function(e3) {
              function n3(t3) {
                var e4, n4, i2, o2, r2;
                for (t3 == null && (t3 = []), this.objects = {}, i2 = 0, o2 = t3.length; o2 > i2; i2++)
                  r2 = t3[i2], n4 = JSON.stringify(r2), (e4 = this.objects)[n4] == null && (e4[n4] = r2);
              }
              return t2(n3, e3), n3.prototype.find = function(t3) {
                var e4;
                return e4 = JSON.stringify(t3), this.objects[e4];
              }, n3;
            }(e2.BasicObject);
          }.call(this), function() {
            e2.ElementStore = function() {
              function t2(t3) {
                this.reset(t3);
              }
              var e3;
              return t2.prototype.add = function(t3) {
                var n2;
                return n2 = e3(t3), this.elements[n2] = t3;
              }, t2.prototype.remove = function(t3) {
                var n2, i2;
                return n2 = e3(t3), (i2 = this.elements[n2]) ? (delete this.elements[n2], i2) : void 0;
              }, t2.prototype.reset = function(t3) {
                var e4, n2, i2;
                for (t3 == null && (t3 = []), this.elements = {}, n2 = 0, i2 = t3.length; i2 > n2; n2++)
                  e4 = t3[n2], this.add(e4);
                return t3;
              }, e3 = function(t3) {
                return t3.dataset.trixStoreKey;
              }, t2;
            }();
          }.call(this), function() {
          }.call(this), function() {
            var t2 = function(t3, e3) {
              function i2() {
                this.constructor = t3;
              }
              for (var o2 in e3)
                n2.call(e3, o2) && (t3[o2] = e3[o2]);
              return i2.prototype = e3.prototype, t3.prototype = new i2(), t3.__super__ = e3.prototype, t3;
            }, n2 = {}.hasOwnProperty;
            e2.Operation = function(e3) {
              function n3() {
                return n3.__super__.constructor.apply(this, arguments);
              }
              return t2(n3, e3), n3.prototype.isPerforming = function() {
                return this.performing === true;
              }, n3.prototype.hasPerformed = function() {
                return this.performed === true;
              }, n3.prototype.hasSucceeded = function() {
                return this.performed && this.succeeded;
              }, n3.prototype.hasFailed = function() {
                return this.performed && !this.succeeded;
              }, n3.prototype.getPromise = function() {
                return this.promise != null ? this.promise : this.promise = new Promise(function(t3) {
                  return function(e4, n4) {
                    return t3.performing = true, t3.perform(function(i2, o2) {
                      return t3.succeeded = i2, t3.performing = false, t3.performed = true, t3.succeeded ? e4(o2) : n4(o2);
                    });
                  };
                }(this));
              }, n3.prototype.perform = function(t3) {
                return t3(false);
              }, n3.prototype.release = function() {
                var t3;
                return (t3 = this.promise) != null && typeof t3.cancel == "function" && t3.cancel(), this.promise = null, this.performing = null, this.performed = null, this.succeeded = null;
              }, n3.proxyMethod("getPromise().then"), n3.proxyMethod("getPromise().catch"), n3;
            }(e2.BasicObject);
          }.call(this), function() {
            var t2, n2, i2, o2, r2, s2 = function(t3, e3) {
              function n3() {
                this.constructor = t3;
              }
              for (var i3 in e3)
                a2.call(e3, i3) && (t3[i3] = e3[i3]);
              return n3.prototype = e3.prototype, t3.prototype = new n3(), t3.__super__ = e3.prototype, t3;
            }, a2 = {}.hasOwnProperty;
            e2.UTF16String = function(t3) {
              function e3(t4, e4) {
                this.ucs2String = t4, this.codepoints = e4, this.length = this.codepoints.length, this.ucs2Length = this.ucs2String.length;
              }
              return s2(e3, t3), e3.box = function(t4) {
                return t4 == null && (t4 = ""), t4 instanceof this ? t4 : this.fromUCS2String(t4 != null ? t4.toString() : void 0);
              }, e3.fromUCS2String = function(t4) {
                return new this(t4, o2(t4));
              }, e3.fromCodepoints = function(t4) {
                return new this(r2(t4), t4);
              }, e3.prototype.offsetToUCS2Offset = function(t4) {
                return r2(this.codepoints.slice(0, Math.max(0, t4))).length;
              }, e3.prototype.offsetFromUCS2Offset = function(t4) {
                return o2(this.ucs2String.slice(0, Math.max(0, t4))).length;
              }, e3.prototype.slice = function() {
                var t4;
                return this.constructor.fromCodepoints((t4 = this.codepoints).slice.apply(t4, arguments));
              }, e3.prototype.charAt = function(t4) {
                return this.slice(t4, t4 + 1);
              }, e3.prototype.isEqualTo = function(t4) {
                return this.constructor.box(t4).ucs2String === this.ucs2String;
              }, e3.prototype.toJSON = function() {
                return this.ucs2String;
              }, e3.prototype.getCacheKey = function() {
                return this.ucs2String;
              }, e3.prototype.toString = function() {
                return this.ucs2String;
              }, e3;
            }(e2.BasicObject), t2 = (typeof Array.from == "function" ? Array.from("\u{1F47C}").length : void 0) === 1, n2 = (typeof " ".codePointAt == "function" ? " ".codePointAt(0) : void 0) != null, i2 = (typeof String.fromCodePoint == "function" ? String.fromCodePoint(32, 128124) : void 0) === " \u{1F47C}", o2 = t2 && n2 ? function(t3) {
              return Array.from(t3).map(function(t4) {
                return t4.codePointAt(0);
              });
            } : function(t3) {
              var e3, n3, i3, o3, r3;
              for (o3 = [], e3 = 0, i3 = t3.length; i3 > e3; )
                r3 = t3.charCodeAt(e3++), r3 >= 55296 && 56319 >= r3 && i3 > e3 && (n3 = t3.charCodeAt(e3++), (64512 & n3) === 56320 ? r3 = ((1023 & r3) << 10) + (1023 & n3) + 65536 : e3--), o3.push(r3);
              return o3;
            }, r2 = i2 ? function(t3) {
              return String.fromCodePoint.apply(String, t3);
            } : function(t3) {
              var e3, n3, i3;
              return e3 = function() {
                var e4, o3, r3;
                for (r3 = [], e4 = 0, o3 = t3.length; o3 > e4; e4++)
                  i3 = t3[e4], n3 = "", i3 > 65535 && (i3 -= 65536, n3 += String.fromCharCode(i3 >>> 10 & 1023 | 55296), i3 = 56320 | 1023 & i3), r3.push(n3 + String.fromCharCode(i3));
                return r3;
              }(), e3.join("");
            };
          }.call(this), function() {
          }.call(this), function() {
          }.call(this), function() {
            e2.config.lang = { attachFiles: "Attach Files", bold: "Bold", bullets: "Bullets", "byte": "Byte", bytes: "Bytes", captionPlaceholder: "Add a caption\u2026", code: "Code", heading1: "Heading", indent: "Increase Level", italic: "Italic", link: "Link", numbers: "Numbers", outdent: "Decrease Level", quote: "Quote", redo: "Redo", remove: "Remove", strike: "Strikethrough", undo: "Undo", unlink: "Unlink", url: "URL", urlPlaceholder: "Enter a URL\u2026", GB: "GB", KB: "KB", MB: "MB", PB: "PB", TB: "TB" };
          }.call(this), function() {
            e2.config.css = { attachment: "attachment", attachmentCaption: "attachment__caption", attachmentCaptionEditor: "attachment__caption-editor", attachmentMetadata: "attachment__metadata", attachmentMetadataContainer: "attachment__metadata-container", attachmentName: "attachment__name", attachmentProgress: "attachment__progress", attachmentSize: "attachment__size", attachmentToolbar: "attachment__toolbar", attachmentGallery: "attachment-gallery" };
          }.call(this), function() {
            var t2;
            e2.config.blockAttributes = t2 = { "default": { tagName: "div", parse: false }, quote: { tagName: "blockquote", nestable: true }, heading1: { tagName: "h1", terminal: true, breakOnReturn: true, group: false }, code: { tagName: "pre", terminal: true, text: { plaintext: true } }, bulletList: { tagName: "ul", parse: false }, bullet: { tagName: "li", listAttribute: "bulletList", group: false, nestable: true, test: function(n2) {
              return e2.tagName(n2.parentNode) === t2[this.listAttribute].tagName;
            } }, numberList: { tagName: "ol", parse: false }, number: { tagName: "li", listAttribute: "numberList", group: false, nestable: true, test: function(n2) {
              return e2.tagName(n2.parentNode) === t2[this.listAttribute].tagName;
            } }, attachmentGallery: { tagName: "div", exclusive: true, terminal: true, parse: false, group: false } };
          }.call(this), function() {
            var t2, n2;
            t2 = e2.config.lang, n2 = [t2.bytes, t2.KB, t2.MB, t2.GB, t2.TB, t2.PB], e2.config.fileSize = { prefix: "IEC", precision: 2, formatter: function(e3) {
              var i2, o2, r2, s2, a2;
              switch (e3) {
                case 0:
                  return "0 " + t2.bytes;
                case 1:
                  return "1 " + t2.byte;
                default:
                  return i2 = function() {
                    switch (this.prefix) {
                      case "SI":
                        return 1e3;
                      case "IEC":
                        return 1024;
                    }
                  }.call(this), o2 = Math.floor(Math.log(e3) / Math.log(i2)), r2 = e3 / Math.pow(i2, o2), s2 = r2.toFixed(this.precision), a2 = s2.replace(/0*$/, "").replace(/\.$/, ""), a2 + " " + n2[o2];
              }
            } };
          }.call(this), function() {
            e2.config.textAttributes = { bold: { tagName: "strong", inheritable: true, parser: function(t2) {
              var e3;
              return e3 = window.getComputedStyle(t2), e3.fontWeight === "bold" || e3.fontWeight >= 600;
            } }, italic: { tagName: "em", inheritable: true, parser: function(t2) {
              var e3;
              return e3 = window.getComputedStyle(t2), e3.fontStyle === "italic";
            } }, href: { groupTagName: "a", parser: function(t2) {
              var n2, i2, o2;
              return n2 = e2.AttachmentView.attachmentSelector, o2 = "a:not(" + n2 + ")", (i2 = e2.findClosestElementFromNode(t2, { matchingSelector: o2 })) ? i2.getAttribute("href") : void 0;
            } }, strike: { tagName: "del", inheritable: true }, frozen: { style: { backgroundColor: "highlight" } } };
          }.call(this), function() {
            var t2, n2, i2, o2, r2;
            r2 = "[data-trix-serialize=false]", o2 = ["contenteditable", "data-trix-id", "data-trix-store-key", "data-trix-mutable", "data-trix-placeholder", "tabindex"], n2 = "data-trix-serialized-attributes", i2 = "[" + n2 + "]", t2 = new RegExp("<!--block-->", "g"), e2.extend({ serializers: { "application/json": function(t3) {
              var n3;
              if (t3 instanceof e2.Document)
                n3 = t3;
              else {
                if (!(t3 instanceof HTMLElement))
                  throw new Error("unserializable object");
                n3 = e2.Document.fromHTML(t3.innerHTML);
              }
              return n3.toSerializableDocument().toJSONString();
            }, "text/html": function(s2) {
              var a2, u, c, l2, h2, p, d, f, g, m, v, y, b, A, C, x, w;
              if (s2 instanceof e2.Document)
                l2 = e2.DocumentView.render(s2);
              else {
                if (!(s2 instanceof HTMLElement))
                  throw new Error("unserializable object");
                l2 = s2.cloneNode(true);
              }
              for (A = l2.querySelectorAll(r2), h2 = 0, g = A.length; g > h2; h2++)
                c = A[h2], e2.removeNode(c);
              for (p = 0, m = o2.length; m > p; p++)
                for (a2 = o2[p], C = l2.querySelectorAll("[" + a2 + "]"), d = 0, v = C.length; v > d; d++)
                  c = C[d], c.removeAttribute(a2);
              for (x = l2.querySelectorAll(i2), f = 0, y = x.length; y > f; f++) {
                c = x[f];
                try {
                  u = JSON.parse(c.getAttribute(n2)), c.removeAttribute(n2);
                  for (b in u)
                    w = u[b], c.setAttribute(b, w);
                } catch (E) {
                }
              }
              return l2.innerHTML.replace(t2, "");
            } }, deserializers: { "application/json": function(t3) {
              return e2.Document.fromJSONString(t3);
            }, "text/html": function(t3) {
              return e2.Document.fromHTML(t3);
            } }, serializeToContentType: function(t3, n3) {
              var i3;
              if (i3 = e2.serializers[n3])
                return i3(t3);
              throw new Error("unknown content type: " + n3);
            }, deserializeFromContentType: function(t3, n3) {
              var i3;
              if (i3 = e2.deserializers[n3])
                return i3(t3);
              throw new Error("unknown content type: " + n3);
            } });
          }.call(this), function() {
            var t2;
            t2 = e2.config.lang, e2.config.toolbar = { getDefaultHTML: function() {
              return '<div class="trix-button-row">\n  <span class="trix-button-group trix-button-group--text-tools" data-trix-button-group="text-tools">\n    <button type="button" class="trix-button trix-button--icon trix-button--icon-bold" data-trix-attribute="bold" data-trix-key="b" title="' + t2.bold + '" tabindex="-1">' + t2.bold + '</button>\n    <button type="button" class="trix-button trix-button--icon trix-button--icon-italic" data-trix-attribute="italic" data-trix-key="i" title="' + t2.italic + '" tabindex="-1">' + t2.italic + '</button>\n    <button type="button" class="trix-button trix-button--icon trix-button--icon-strike" data-trix-attribute="strike" title="' + t2.strike + '" tabindex="-1">' + t2.strike + '</button>\n    <button type="button" class="trix-button trix-button--icon trix-button--icon-link" data-trix-attribute="href" data-trix-action="link" data-trix-key="k" title="' + t2.link + '" tabindex="-1">' + t2.link + '</button>\n  </span>\n\n  <span class="trix-button-group trix-button-group--block-tools" data-trix-button-group="block-tools">\n    <button type="button" class="trix-button trix-button--icon trix-button--icon-heading-1" data-trix-attribute="heading1" title="' + t2.heading1 + '" tabindex="-1">' + t2.heading1 + '</button>\n    <button type="button" class="trix-button trix-button--icon trix-button--icon-quote" data-trix-attribute="quote" title="' + t2.quote + '" tabindex="-1">' + t2.quote + '</button>\n    <button type="button" class="trix-button trix-button--icon trix-button--icon-code" data-trix-attribute="code" title="' + t2.code + '" tabindex="-1">' + t2.code + '</button>\n    <button type="button" class="trix-button trix-button--icon trix-button--icon-bullet-list" data-trix-attribute="bullet" title="' + t2.bullets + '" tabindex="-1">' + t2.bullets + '</button>\n    <button type="button" class="trix-button trix-button--icon trix-button--icon-number-list" data-trix-attribute="number" title="' + t2.numbers + '" tabindex="-1">' + t2.numbers + '</button>\n    <button type="button" class="trix-button trix-button--icon trix-button--icon-decrease-nesting-level" data-trix-action="decreaseNestingLevel" title="' + t2.outdent + '" tabindex="-1">' + t2.outdent + '</button>\n    <button type="button" class="trix-button trix-button--icon trix-button--icon-increase-nesting-level" data-trix-action="increaseNestingLevel" title="' + t2.indent + '" tabindex="-1">' + t2.indent + '</button>\n  </span>\n\n  <span class="trix-button-group trix-button-group--file-tools" data-trix-button-group="file-tools">\n    <button type="button" class="trix-button trix-button--icon trix-button--icon-attach" data-trix-action="attachFiles" title="' + t2.attachFiles + '" tabindex="-1">' + t2.attachFiles + '</button>\n  </span>\n\n  <span class="trix-button-group-spacer"></span>\n\n  <span class="trix-button-group trix-button-group--history-tools" data-trix-button-group="history-tools">\n    <button type="button" class="trix-button trix-button--icon trix-button--icon-undo" data-trix-action="undo" data-trix-key="z" title="' + t2.undo + '" tabindex="-1">' + t2.undo + '</button>\n    <button type="button" class="trix-button trix-button--icon trix-button--icon-redo" data-trix-action="redo" data-trix-key="shift+z" title="' + t2.redo + '" tabindex="-1">' + t2.redo + '</button>\n  </span>\n</div>\n\n<div class="trix-dialogs" data-trix-dialogs>\n  <div class="trix-dialog trix-dialog--link" data-trix-dialog="href" data-trix-dialog-attribute="href">\n    <div class="trix-dialog__link-fields">\n      <input type="url" name="href" class="trix-input trix-input--dialog" placeholder="' + t2.urlPlaceholder + '" aria-label="' + t2.url + '" required data-trix-input>\n      <div class="trix-button-group">\n        <input type="button" class="trix-button trix-button--dialog" value="' + t2.link + '" data-trix-method="setAttribute">\n        <input type="button" class="trix-button trix-button--dialog" value="' + t2.unlink + '" data-trix-method="removeAttribute">\n      </div>\n    </div>\n  </div>\n</div>';
            } };
          }.call(this), function() {
            e2.config.undoInterval = 5e3;
          }.call(this), function() {
            e2.config.attachments = { preview: { presentation: "gallery", caption: { name: true, size: true } }, file: { caption: { size: true } } };
          }.call(this), function() {
            e2.config.keyNames = { 8: "backspace", 9: "tab", 13: "return", 27: "escape", 37: "left", 39: "right", 46: "delete", 68: "d", 72: "h", 79: "o" };
          }.call(this), function() {
            e2.config.input = { level2Enabled: true, getLevel: function() {
              return this.level2Enabled && e2.browser.supportsInputEvents ? 2 : 0;
            }, pickFiles: function(t2) {
              var n2;
              return n2 = e2.makeElement("input", { type: "file", multiple: true, hidden: true, id: this.fileInputId }), n2.addEventListener("change", function() {
                return t2(n2.files), e2.removeNode(n2);
              }), e2.removeNode(document.getElementById(this.fileInputId)), document.body.appendChild(n2), n2.click();
            }, fileInputId: "trix-file-input-" + Date.now().toString(16) };
          }.call(this), function() {
          }.call(this), function() {
            e2.registerElement("trix-toolbar", { defaultCSS: "%t {\n  display: block;\n}\n\n%t {\n  white-space: nowrap;\n}\n\n%t [data-trix-dialog] {\n  display: none;\n}\n\n%t [data-trix-dialog][data-trix-active] {\n  display: block;\n}\n\n%t [data-trix-dialog] [data-trix-validate]:invalid {\n  background-color: #ffdddd;\n}", initialize: function() {
              return this.innerHTML === "" ? this.innerHTML = e2.config.toolbar.getDefaultHTML() : void 0;
            } });
          }.call(this), function() {
            var t2 = function(t3, e3) {
              function i3() {
                this.constructor = t3;
              }
              for (var o2 in e3)
                n2.call(e3, o2) && (t3[o2] = e3[o2]);
              return i3.prototype = e3.prototype, t3.prototype = new i3(), t3.__super__ = e3.prototype, t3;
            }, n2 = {}.hasOwnProperty, i2 = [].indexOf || function(t3) {
              for (var e3 = 0, n3 = this.length; n3 > e3; e3++)
                if (e3 in this && this[e3] === t3)
                  return e3;
              return -1;
            };
            e2.ObjectView = function(n3) {
              function o2(t3, e3) {
                this.object = t3, this.options = e3 != null ? e3 : {}, this.childViews = [], this.rootView = this;
              }
              return t2(o2, n3), o2.prototype.getNodes = function() {
                var t3, e3, n4, i3, o3;
                for (this.nodes == null && (this.nodes = this.createNodes()), i3 = this.nodes, o3 = [], t3 = 0, e3 = i3.length; e3 > t3; t3++)
                  n4 = i3[t3], o3.push(n4.cloneNode(true));
                return o3;
              }, o2.prototype.invalidate = function() {
                var t3;
                return this.nodes = null, this.childViews = [], (t3 = this.parentView) != null ? t3.invalidate() : void 0;
              }, o2.prototype.invalidateViewForObject = function(t3) {
                var e3;
                return (e3 = this.findViewForObject(t3)) != null ? e3.invalidate() : void 0;
              }, o2.prototype.findOrCreateCachedChildView = function(t3, e3) {
                var n4;
                return (n4 = this.getCachedViewForObject(e3)) ? this.recordChildView(n4) : (n4 = this.createChildView.apply(this, arguments), this.cacheViewForObject(n4, e3)), n4;
              }, o2.prototype.createChildView = function(t3, n4, i3) {
                var o3;
                return i3 == null && (i3 = {}), n4 instanceof e2.ObjectGroup && (i3.viewClass = t3, t3 = e2.ObjectGroupView), o3 = new t3(n4, i3), this.recordChildView(o3);
              }, o2.prototype.recordChildView = function(t3) {
                return t3.parentView = this, t3.rootView = this.rootView, this.childViews.push(t3), t3;
              }, o2.prototype.getAllChildViews = function() {
                var t3, e3, n4, i3, o3;
                for (o3 = [], i3 = this.childViews, e3 = 0, n4 = i3.length; n4 > e3; e3++)
                  t3 = i3[e3], o3.push(t3), o3 = o3.concat(t3.getAllChildViews());
                return o3;
              }, o2.prototype.findElement = function() {
                return this.findElementForObject(this.object);
              }, o2.prototype.findElementForObject = function(t3) {
                var e3;
                return (e3 = t3 != null ? t3.id : void 0) ? this.rootView.element.querySelector("[data-trix-id='" + e3 + "']") : void 0;
              }, o2.prototype.findViewForObject = function(t3) {
                var e3, n4, i3, o3;
                for (i3 = this.getAllChildViews(), e3 = 0, n4 = i3.length; n4 > e3; e3++)
                  if (o3 = i3[e3], o3.object === t3)
                    return o3;
              }, o2.prototype.getViewCache = function() {
                return this.rootView !== this ? this.rootView.getViewCache() : this.isViewCachingEnabled() ? this.viewCache != null ? this.viewCache : this.viewCache = {} : void 0;
              }, o2.prototype.isViewCachingEnabled = function() {
                return this.shouldCacheViews !== false;
              }, o2.prototype.enableViewCaching = function() {
                return this.shouldCacheViews = true;
              }, o2.prototype.disableViewCaching = function() {
                return this.shouldCacheViews = false;
              }, o2.prototype.getCachedViewForObject = function(t3) {
                var e3;
                return (e3 = this.getViewCache()) != null ? e3[t3.getCacheKey()] : void 0;
              }, o2.prototype.cacheViewForObject = function(t3, e3) {
                var n4;
                return (n4 = this.getViewCache()) != null ? n4[e3.getCacheKey()] = t3 : void 0;
              }, o2.prototype.garbageCollectCachedViews = function() {
                var t3, e3, n4, o3, r2, s2;
                if (t3 = this.getViewCache()) {
                  s2 = this.getAllChildViews().concat(this), n4 = function() {
                    var t4, e4, n5;
                    for (n5 = [], t4 = 0, e4 = s2.length; e4 > t4; t4++)
                      r2 = s2[t4], n5.push(r2.object.getCacheKey());
                    return n5;
                  }(), o3 = [];
                  for (e3 in t3)
                    i2.call(n4, e3) < 0 && o3.push(delete t3[e3]);
                  return o3;
                }
              }, o2;
            }(e2.BasicObject);
          }.call(this), function() {
            var t2 = function(t3, e3) {
              function i2() {
                this.constructor = t3;
              }
              for (var o2 in e3)
                n2.call(e3, o2) && (t3[o2] = e3[o2]);
              return i2.prototype = e3.prototype, t3.prototype = new i2(), t3.__super__ = e3.prototype, t3;
            }, n2 = {}.hasOwnProperty;
            e2.ObjectGroupView = function(e3) {
              function n3() {
                n3.__super__.constructor.apply(this, arguments), this.objectGroup = this.object, this.viewClass = this.options.viewClass, delete this.options.viewClass;
              }
              return t2(n3, e3), n3.prototype.getChildViews = function() {
                var t3, e4, n4, i2;
                if (!this.childViews.length)
                  for (i2 = this.objectGroup.getObjects(), t3 = 0, e4 = i2.length; e4 > t3; t3++)
                    n4 = i2[t3], this.findOrCreateCachedChildView(this.viewClass, n4, this.options);
                return this.childViews;
              }, n3.prototype.createNodes = function() {
                var t3, e4, n4, i2, o2, r2, s2, a2, u;
                for (t3 = this.createContainerElement(), s2 = this.getChildViews(), e4 = 0, i2 = s2.length; i2 > e4; e4++)
                  for (u = s2[e4], a2 = u.getNodes(), n4 = 0, o2 = a2.length; o2 > n4; n4++)
                    r2 = a2[n4], t3.appendChild(r2);
                return [t3];
              }, n3.prototype.createContainerElement = function(t3) {
                return t3 == null && (t3 = this.objectGroup.getDepth()), this.getChildViews()[0].createContainerElement(t3);
              }, n3;
            }(e2.ObjectView);
          }.call(this), function() {
            var t2 = function(t3, e3) {
              function i2() {
                this.constructor = t3;
              }
              for (var o2 in e3)
                n2.call(e3, o2) && (t3[o2] = e3[o2]);
              return i2.prototype = e3.prototype, t3.prototype = new i2(), t3.__super__ = e3.prototype, t3;
            }, n2 = {}.hasOwnProperty;
            e2.Controller = function(e3) {
              function n3() {
                return n3.__super__.constructor.apply(this, arguments);
              }
              return t2(n3, e3), n3;
            }(e2.BasicObject);
          }.call(this), function() {
            var t2, n2, i2, o2, r2, s2, a2 = function(t3, e3) {
              return function() {
                return t3.apply(e3, arguments);
              };
            }, u = function(t3, e3) {
              function n3() {
                this.constructor = t3;
              }
              for (var i3 in e3)
                c.call(e3, i3) && (t3[i3] = e3[i3]);
              return n3.prototype = e3.prototype, t3.prototype = new n3(), t3.__super__ = e3.prototype, t3;
            }, c = {}.hasOwnProperty, l2 = [].indexOf || function(t3) {
              for (var e3 = 0, n3 = this.length; n3 > e3; e3++)
                if (e3 in this && this[e3] === t3)
                  return e3;
              return -1;
            };
            t2 = e2.findClosestElementFromNode, i2 = e2.nodeIsEmptyTextNode, n2 = e2.nodeIsBlockStartComment, o2 = e2.normalizeSpaces, r2 = e2.summarizeStringChange, s2 = e2.tagName, e2.MutationObserver = function(e3) {
              function c2(t3) {
                this.element = t3, this.didMutate = a2(this.didMutate, this), this.observer = new window.MutationObserver(this.didMutate), this.start();
              }
              var h2, p, d, f;
              return u(c2, e3), p = "data-trix-mutable", d = "[" + p + "]", f = { attributes: true, childList: true, characterData: true, characterDataOldValue: true, subtree: true }, c2.prototype.start = function() {
                return this.reset(), this.observer.observe(this.element, f);
              }, c2.prototype.stop = function() {
                return this.observer.disconnect();
              }, c2.prototype.didMutate = function(t3) {
                var e4, n3;
                return (e4 = this.mutations).push.apply(e4, this.findSignificantMutations(t3)), this.mutations.length ? ((n3 = this.delegate) != null && typeof n3.elementDidMutate == "function" && n3.elementDidMutate(this.getMutationSummary()), this.reset()) : void 0;
              }, c2.prototype.reset = function() {
                return this.mutations = [];
              }, c2.prototype.findSignificantMutations = function(t3) {
                var e4, n3, i3, o3;
                for (o3 = [], e4 = 0, n3 = t3.length; n3 > e4; e4++)
                  i3 = t3[e4], this.mutationIsSignificant(i3) && o3.push(i3);
                return o3;
              }, c2.prototype.mutationIsSignificant = function(t3) {
                var e4, n3, i3, o3;
                if (this.nodeIsMutable(t3.target))
                  return false;
                for (o3 = this.nodesModifiedByMutation(t3), e4 = 0, n3 = o3.length; n3 > e4; e4++)
                  if (i3 = o3[e4], this.nodeIsSignificant(i3))
                    return true;
                return false;
              }, c2.prototype.nodeIsSignificant = function(t3) {
                return t3 !== this.element && !this.nodeIsMutable(t3) && !i2(t3);
              }, c2.prototype.nodeIsMutable = function(e4) {
                return t2(e4, { matchingSelector: d });
              }, c2.prototype.nodesModifiedByMutation = function(t3) {
                var e4;
                switch (e4 = [], t3.type) {
                  case "attributes":
                    t3.attributeName !== p && e4.push(t3.target);
                    break;
                  case "characterData":
                    e4.push(t3.target.parentNode), e4.push(t3.target);
                    break;
                  case "childList":
                    e4.push.apply(e4, t3.addedNodes), e4.push.apply(e4, t3.removedNodes);
                }
                return e4;
              }, c2.prototype.getMutationSummary = function() {
                return this.getTextMutationSummary();
              }, c2.prototype.getTextMutationSummary = function() {
                var t3, e4, n3, i3, o3, r3, s3, a3, u2, c3, h3;
                for (a3 = this.getTextChangesFromCharacterData(), n3 = a3.additions, o3 = a3.deletions, h3 = this.getTextChangesFromChildList(), u2 = h3.additions, r3 = 0, s3 = u2.length; s3 > r3; r3++)
                  e4 = u2[r3], l2.call(n3, e4) < 0 && n3.push(e4);
                return o3.push.apply(o3, h3.deletions), c3 = {}, (t3 = n3.join("")) && (c3.textAdded = t3), (i3 = o3.join("")) && (c3.textDeleted = i3), c3;
              }, c2.prototype.getMutationsByType = function(t3) {
                var e4, n3, i3, o3, r3;
                for (o3 = this.mutations, r3 = [], e4 = 0, n3 = o3.length; n3 > e4; e4++)
                  i3 = o3[e4], i3.type === t3 && r3.push(i3);
                return r3;
              }, c2.prototype.getTextChangesFromChildList = function() {
                var t3, e4, i3, r3, s3, a3, u2, c3, l3, p2, d2;
                for (t3 = [], u2 = [], a3 = this.getMutationsByType("childList"), e4 = 0, r3 = a3.length; r3 > e4; e4++)
                  s3 = a3[e4], t3.push.apply(t3, s3.addedNodes), u2.push.apply(u2, s3.removedNodes);
                return c3 = t3.length === 0 && u2.length === 1 && n2(u2[0]), c3 ? (p2 = [], d2 = ["\n"]) : (p2 = h2(t3), d2 = h2(u2)), { additions: function() {
                  var t4, e5, n3;
                  for (n3 = [], i3 = t4 = 0, e5 = p2.length; e5 > t4; i3 = ++t4)
                    l3 = p2[i3], l3 !== d2[i3] && n3.push(o2(l3));
                  return n3;
                }(), deletions: function() {
                  var t4, e5, n3;
                  for (n3 = [], i3 = t4 = 0, e5 = d2.length; e5 > t4; i3 = ++t4)
                    l3 = d2[i3], l3 !== p2[i3] && n3.push(o2(l3));
                  return n3;
                }() };
              }, c2.prototype.getTextChangesFromCharacterData = function() {
                var t3, e4, n3, i3, s3, a3, u2, c3;
                return e4 = this.getMutationsByType("characterData"), e4.length && (c3 = e4[0], n3 = e4[e4.length - 1], s3 = o2(c3.oldValue), i3 = o2(n3.target.data), a3 = r2(s3, i3), t3 = a3.added, u2 = a3.removed), { additions: t3 ? [t3] : [], deletions: u2 ? [u2] : [] };
              }, h2 = function(t3) {
                var e4, n3, i3, o3;
                for (t3 == null && (t3 = []), o3 = [], e4 = 0, n3 = t3.length; n3 > e4; e4++)
                  switch (i3 = t3[e4], i3.nodeType) {
                    case Node.TEXT_NODE:
                      o3.push(i3.data);
                      break;
                    case Node.ELEMENT_NODE:
                      s2(i3) === "br" ? o3.push("\n") : o3.push.apply(o3, h2(i3.childNodes));
                  }
                return o3;
              }, c2;
            }(e2.BasicObject);
          }.call(this), function() {
            var t2 = function(t3, e3) {
              function i2() {
                this.constructor = t3;
              }
              for (var o2 in e3)
                n2.call(e3, o2) && (t3[o2] = e3[o2]);
              return i2.prototype = e3.prototype, t3.prototype = new i2(), t3.__super__ = e3.prototype, t3;
            }, n2 = {}.hasOwnProperty;
            e2.FileVerificationOperation = function(e3) {
              function n3(t3) {
                this.file = t3;
              }
              return t2(n3, e3), n3.prototype.perform = function(t3) {
                var e4;
                return e4 = new FileReader(), e4.onerror = function() {
                  return t3(false);
                }, e4.onload = function(n4) {
                  return function() {
                    e4.onerror = null;
                    try {
                      e4.abort();
                    } catch (i2) {
                    }
                    return t3(true, n4.file);
                  };
                }(this), e4.readAsArrayBuffer(this.file);
              }, n3;
            }(e2.Operation);
          }.call(this), function() {
            var t2, n2, i2 = function(t3, e3) {
              function n3() {
                this.constructor = t3;
              }
              for (var i3 in e3)
                o2.call(e3, i3) && (t3[i3] = e3[i3]);
              return n3.prototype = e3.prototype, t3.prototype = new n3(), t3.__super__ = e3.prototype, t3;
            }, o2 = {}.hasOwnProperty;
            t2 = e2.handleEvent, n2 = e2.innerElementIsActive, e2.InputController = function(o3) {
              function r2(n3) {
                var i3;
                this.element = n3, this.mutationObserver = new e2.MutationObserver(this.element), this.mutationObserver.delegate = this;
                for (i3 in this.events)
                  t2(i3, { onElement: this.element, withCallback: this.handlerFor(i3) });
              }
              return i2(r2, o3), r2.prototype.events = {}, r2.prototype.elementDidMutate = function() {
              }, r2.prototype.editorWillSyncDocumentView = function() {
                return this.mutationObserver.stop();
              }, r2.prototype.editorDidSyncDocumentView = function() {
                return this.mutationObserver.start();
              }, r2.prototype.requestRender = function() {
                var t3;
                return (t3 = this.delegate) != null && typeof t3.inputControllerDidRequestRender == "function" ? t3.inputControllerDidRequestRender() : void 0;
              }, r2.prototype.requestReparse = function() {
                var t3;
                return (t3 = this.delegate) != null && typeof t3.inputControllerDidRequestReparse == "function" && t3.inputControllerDidRequestReparse(), this.requestRender();
              }, r2.prototype.attachFiles = function(t3) {
                var n3, i3;
                return i3 = function() {
                  var i4, o4, r3;
                  for (r3 = [], i4 = 0, o4 = t3.length; o4 > i4; i4++)
                    n3 = t3[i4], r3.push(new e2.FileVerificationOperation(n3));
                  return r3;
                }(), Promise.all(i3).then(function(t4) {
                  return function(e3) {
                    return t4.handleInput(function() {
                      var t5, n4;
                      return (t5 = this.delegate) != null && t5.inputControllerWillAttachFiles(), (n4 = this.responder) != null && n4.insertFiles(e3), this.requestRender();
                    });
                  };
                }(this));
              }, r2.prototype.handlerFor = function(t3) {
                return function(e3) {
                  return function(i3) {
                    return i3.defaultPrevented ? void 0 : e3.handleInput(function() {
                      return n2(this.element) ? void 0 : (this.eventName = t3, this.events[t3].call(this, i3));
                    });
                  };
                }(this);
              }, r2.prototype.handleInput = function(t3) {
                var e3, n3;
                try {
                  return (e3 = this.delegate) != null && e3.inputControllerWillHandleInput(), t3.call(this);
                } finally {
                  (n3 = this.delegate) != null && n3.inputControllerDidHandleInput();
                }
              }, r2.prototype.createLinkHTML = function(t3, e3) {
                var n3;
                return n3 = document.createElement("a"), n3.href = t3, n3.textContent = e3 != null ? e3 : t3, n3.outerHTML;
              }, r2;
            }(e2.BasicObject);
          }.call(this), function() {
            var t2, n2, i2, o2, r2, s2, a2, u, c, l2, h2, p, d, f = function(t3, e3) {
              function n3() {
                this.constructor = t3;
              }
              for (var i3 in e3)
                g.call(e3, i3) && (t3[i3] = e3[i3]);
              return n3.prototype = e3.prototype, t3.prototype = new n3(), t3.__super__ = e3.prototype, t3;
            }, g = {}.hasOwnProperty, m = [].indexOf || function(t3) {
              for (var e3 = 0, n3 = this.length; n3 > e3; e3++)
                if (e3 in this && this[e3] === t3)
                  return e3;
              return -1;
            };
            c = e2.makeElement, l2 = e2.objectsAreEqual, d = e2.tagName, n2 = e2.browser, a2 = e2.keyEventIsKeyboardCommand, o2 = e2.dataTransferIsWritable, i2 = e2.dataTransferIsPlainText, u = e2.config.keyNames, e2.Level0InputController = function(n3) {
              function s3() {
                s3.__super__.constructor.apply(this, arguments), this.resetInputSummary();
              }
              var d2;
              return f(s3, n3), d2 = 0, s3.prototype.setInputSummary = function(t3) {
                var e3, n4;
                t3 == null && (t3 = {}), this.inputSummary.eventName = this.eventName;
                for (e3 in t3)
                  n4 = t3[e3], this.inputSummary[e3] = n4;
                return this.inputSummary;
              }, s3.prototype.resetInputSummary = function() {
                return this.inputSummary = {};
              }, s3.prototype.reset = function() {
                return this.resetInputSummary(), e2.selectionChangeObserver.reset();
              }, s3.prototype.elementDidMutate = function(t3) {
                var e3;
                return this.isComposing() ? (e3 = this.delegate) != null && typeof e3.inputControllerDidAllowUnhandledInput == "function" ? e3.inputControllerDidAllowUnhandledInput() : void 0 : this.handleInput(function() {
                  return this.mutationIsSignificant(t3) && (this.mutationIsExpected(t3) ? this.requestRender() : this.requestReparse()), this.reset();
                });
              }, s3.prototype.mutationIsExpected = function(t3) {
                var e3, n4, i3, o3, r3, s4, a3, u2, c2, l3;
                return a3 = t3.textAdded, u2 = t3.textDeleted, this.inputSummary.preferDocument ? true : (e3 = a3 != null ? a3 === this.inputSummary.textAdded : !this.inputSummary.textAdded, n4 = u2 != null ? this.inputSummary.didDelete : !this.inputSummary.didDelete, c2 = (a3 === "\n" || a3 === " \n") && !e3, l3 = u2 === "\n" && !n4, s4 = c2 && !l3 || l3 && !c2, s4 && (o3 = this.getSelectedRange()) && (i3 = c2 ? a3.replace(/\n$/, "").length || -1 : (a3 != null ? a3.length : void 0) || 1, (r3 = this.responder) != null ? r3.positionIsBlockBreak(o3[1] + i3) : void 0) ? true : e3 && n4);
              }, s3.prototype.mutationIsSignificant = function(t3) {
                var e3, n4, i3;
                return i3 = Object.keys(t3).length > 0, e3 = ((n4 = this.compositionInput) != null ? n4.getEndData() : void 0) === "", i3 || !e3;
              }, s3.prototype.events = { keydown: function(t3) {
                var n4, i3, o3, r3, s4, c2, l3, h3, p2;
                if (this.isComposing() || this.resetInputSummary(), this.inputSummary.didInput = true, r3 = u[t3.keyCode]) {
                  for (i3 = this.keys, h3 = ["ctrl", "alt", "shift", "meta"], o3 = 0, c2 = h3.length; c2 > o3; o3++)
                    l3 = h3[o3], t3[l3 + "Key"] && (l3 === "ctrl" && (l3 = "control"), i3 = i3 != null ? i3[l3] : void 0);
                  (i3 != null ? i3[r3] : void 0) != null && (this.setInputSummary({ keyName: r3 }), e2.selectionChangeObserver.reset(), i3[r3].call(this, t3));
                }
                return a2(t3) && (n4 = String.fromCharCode(t3.keyCode).toLowerCase()) && (s4 = function() {
                  var e3, n5, i4, o4;
                  for (i4 = ["alt", "shift"], o4 = [], e3 = 0, n5 = i4.length; n5 > e3; e3++)
                    l3 = i4[e3], t3[l3 + "Key"] && o4.push(l3);
                  return o4;
                }(), s4.push(n4), (p2 = this.delegate) != null ? p2.inputControllerDidReceiveKeyboardCommand(s4) : void 0) ? t3.preventDefault() : void 0;
              }, keypress: function(t3) {
                var e3, n4, i3;
                if (this.inputSummary.eventName == null && !t3.metaKey && (!t3.ctrlKey || t3.altKey))
                  return (i3 = p(t3)) ? ((e3 = this.delegate) != null && e3.inputControllerWillPerformTyping(), (n4 = this.responder) != null && n4.insertString(i3), this.setInputSummary({ textAdded: i3, didDelete: this.selectionIsExpanded() })) : void 0;
              }, textInput: function(t3) {
                var e3, n4, i3, o3;
                return e3 = t3.data, o3 = this.inputSummary.textAdded, o3 && o3 !== e3 && o3.toUpperCase() === e3 ? (n4 = this.getSelectedRange(), this.setSelectedRange([n4[0], n4[1] + o3.length]), (i3 = this.responder) != null && i3.insertString(e3), this.setInputSummary({ textAdded: e3 }), this.setSelectedRange(n4)) : void 0;
              }, dragenter: function(t3) {
                return t3.preventDefault();
              }, dragstart: function(t3) {
                var e3, n4;
                return n4 = t3.target, this.serializeSelectionToDataTransfer(t3.dataTransfer), this.draggedRange = this.getSelectedRange(), (e3 = this.delegate) != null && typeof e3.inputControllerDidStartDrag == "function" ? e3.inputControllerDidStartDrag() : void 0;
              }, dragover: function(t3) {
                var e3, n4;
                return !this.draggedRange && !this.canAcceptDataTransfer(t3.dataTransfer) || (t3.preventDefault(), e3 = { x: t3.clientX, y: t3.clientY }, l2(e3, this.draggingPoint)) ? void 0 : (this.draggingPoint = e3, (n4 = this.delegate) != null && typeof n4.inputControllerDidReceiveDragOverPoint == "function" ? n4.inputControllerDidReceiveDragOverPoint(this.draggingPoint) : void 0);
              }, dragend: function() {
                var t3;
                return (t3 = this.delegate) != null && typeof t3.inputControllerDidCancelDrag == "function" && t3.inputControllerDidCancelDrag(), this.draggedRange = null, this.draggingPoint = null;
              }, drop: function(t3) {
                var n4, i3, o3, r3, s4, a3, u2, c2, l3;
                return t3.preventDefault(), o3 = (s4 = t3.dataTransfer) != null ? s4.files : void 0, r3 = { x: t3.clientX, y: t3.clientY }, (a3 = this.responder) != null && a3.setLocationRangeFromPointRange(r3), (o3 != null ? o3.length : void 0) ? this.attachFiles(o3) : this.draggedRange ? ((u2 = this.delegate) != null && u2.inputControllerWillMoveText(), (c2 = this.responder) != null && c2.moveTextFromRange(this.draggedRange), this.draggedRange = null, this.requestRender()) : (i3 = t3.dataTransfer.getData("application/x-trix-document")) && (n4 = e2.Document.fromJSONString(i3), (l3 = this.responder) != null && l3.insertDocument(n4), this.requestRender()), this.draggedRange = null, this.draggingPoint = null;
              }, cut: function(t3) {
                var e3, n4;
                return ((e3 = this.responder) != null ? e3.selectionIsExpanded() : void 0) && (this.serializeSelectionToDataTransfer(t3.clipboardData) && t3.preventDefault(), (n4 = this.delegate) != null && n4.inputControllerWillCutText(), this.deleteInDirection("backward"), t3.defaultPrevented) ? this.requestRender() : void 0;
              }, copy: function(t3) {
                var e3;
                return ((e3 = this.responder) != null ? e3.selectionIsExpanded() : void 0) && this.serializeSelectionToDataTransfer(t3.clipboardData) ? t3.preventDefault() : void 0;
              }, paste: function(t3) {
                var n4, o3, s4, a3, u2, c2, l3, p2, f2, g2, v, y, b, A, C, x, w, E, S, R, k, D, L;
                return n4 = (p2 = t3.clipboardData) != null ? p2 : t3.testClipboardData, l3 = { clipboard: n4 }, n4 == null || h2(t3) ? void this.getPastedHTMLUsingHiddenElement(function(t4) {
                  return function(e3) {
                    var n5, i3, o4;
                    return l3.type = "text/html", l3.html = e3, (n5 = t4.delegate) != null && n5.inputControllerWillPaste(l3), (i3 = t4.responder) != null && i3.insertHTML(l3.html), t4.requestRender(), (o4 = t4.delegate) != null ? o4.inputControllerDidPaste(l3) : void 0;
                  };
                }(this)) : ((a3 = n4.getData("URL")) ? (l3.type = "text/html", L = (c2 = n4.getData("public.url-name")) ? e2.squishBreakableWhitespace(c2).trim() : a3, l3.html = this.createLinkHTML(a3, L), (f2 = this.delegate) != null && f2.inputControllerWillPaste(l3), this.setInputSummary({ textAdded: L, didDelete: this.selectionIsExpanded() }), (C = this.responder) != null && C.insertHTML(l3.html), this.requestRender(), (x = this.delegate) != null && x.inputControllerDidPaste(l3)) : i2(n4) ? (l3.type = "text/plain", l3.string = n4.getData("text/plain"), (w = this.delegate) != null && w.inputControllerWillPaste(l3), this.setInputSummary({ textAdded: l3.string, didDelete: this.selectionIsExpanded() }), (E = this.responder) != null && E.insertString(l3.string), this.requestRender(), (S = this.delegate) != null && S.inputControllerDidPaste(l3)) : (u2 = n4.getData("text/html")) ? (l3.type = "text/html", l3.html = u2, (R = this.delegate) != null && R.inputControllerWillPaste(l3), (k = this.responder) != null && k.insertHTML(l3.html), this.requestRender(), (D = this.delegate) != null && D.inputControllerDidPaste(l3)) : m.call(n4.types, "Files") >= 0 && (s4 = (g2 = n4.items) != null && (v = g2[0]) != null && typeof v.getAsFile == "function" ? v.getAsFile() : void 0) && (!s4.name && (o3 = r2(s4)) && (s4.name = "pasted-file-" + ++d2 + "." + o3), l3.type = "File", l3.file = s4, (y = this.delegate) != null && y.inputControllerWillAttachFiles(), (b = this.responder) != null && b.insertFile(l3.file), this.requestRender(), (A = this.delegate) != null && A.inputControllerDidPaste(l3)), t3.preventDefault());
              }, compositionstart: function(t3) {
                return this.getCompositionInput().start(t3.data);
              }, compositionupdate: function(t3) {
                return this.getCompositionInput().update(t3.data);
              }, compositionend: function(t3) {
                return this.getCompositionInput().end(t3.data);
              }, beforeinput: function() {
                return this.inputSummary.didInput = true;
              }, input: function(t3) {
                return this.inputSummary.didInput = true, t3.stopPropagation();
              } }, s3.prototype.keys = { backspace: function(t3) {
                var e3;
                return (e3 = this.delegate) != null && e3.inputControllerWillPerformTyping(), this.deleteInDirection("backward", t3);
              }, "delete": function(t3) {
                var e3;
                return (e3 = this.delegate) != null && e3.inputControllerWillPerformTyping(), this.deleteInDirection("forward", t3);
              }, "return": function() {
                var t3, e3;
                return this.setInputSummary({ preferDocument: true }), (t3 = this.delegate) != null && t3.inputControllerWillPerformTyping(), (e3 = this.responder) != null ? e3.insertLineBreak() : void 0;
              }, tab: function(t3) {
                var e3, n4;
                return ((e3 = this.responder) != null ? e3.canIncreaseNestingLevel() : void 0) ? ((n4 = this.responder) != null && n4.increaseNestingLevel(), this.requestRender(), t3.preventDefault()) : void 0;
              }, left: function(t3) {
                var e3;
                return this.selectionIsInCursorTarget() ? (t3.preventDefault(), (e3 = this.responder) != null ? e3.moveCursorInDirection("backward") : void 0) : void 0;
              }, right: function(t3) {
                var e3;
                return this.selectionIsInCursorTarget() ? (t3.preventDefault(), (e3 = this.responder) != null ? e3.moveCursorInDirection("forward") : void 0) : void 0;
              }, control: { d: function(t3) {
                var e3;
                return (e3 = this.delegate) != null && e3.inputControllerWillPerformTyping(), this.deleteInDirection("forward", t3);
              }, h: function(t3) {
                var e3;
                return (e3 = this.delegate) != null && e3.inputControllerWillPerformTyping(), this.deleteInDirection("backward", t3);
              }, o: function(t3) {
                var e3, n4;
                return t3.preventDefault(), (e3 = this.delegate) != null && e3.inputControllerWillPerformTyping(), (n4 = this.responder) != null && n4.insertString("\n", { updatePosition: false }), this.requestRender();
              } }, shift: { "return": function(t3) {
                var e3, n4;
                return (e3 = this.delegate) != null && e3.inputControllerWillPerformTyping(), (n4 = this.responder) != null && n4.insertString("\n"), this.requestRender(), t3.preventDefault();
              }, tab: function(t3) {
                var e3, n4;
                return ((e3 = this.responder) != null ? e3.canDecreaseNestingLevel() : void 0) ? ((n4 = this.responder) != null && n4.decreaseNestingLevel(), this.requestRender(), t3.preventDefault()) : void 0;
              }, left: function(t3) {
                return this.selectionIsInCursorTarget() ? (t3.preventDefault(), this.expandSelectionInDirection("backward")) : void 0;
              }, right: function(t3) {
                return this.selectionIsInCursorTarget() ? (t3.preventDefault(), this.expandSelectionInDirection("forward")) : void 0;
              } }, alt: { backspace: function() {
                var t3;
                return this.setInputSummary({ preferDocument: false }), (t3 = this.delegate) != null ? t3.inputControllerWillPerformTyping() : void 0;
              } }, meta: { backspace: function() {
                var t3;
                return this.setInputSummary({ preferDocument: false }), (t3 = this.delegate) != null ? t3.inputControllerWillPerformTyping() : void 0;
              } } }, s3.prototype.getCompositionInput = function() {
                return this.isComposing() ? this.compositionInput : this.compositionInput = new t2(this);
              }, s3.prototype.isComposing = function() {
                return this.compositionInput != null && !this.compositionInput.isEnded();
              }, s3.prototype.deleteInDirection = function(t3, e3) {
                var n4;
                return ((n4 = this.responder) != null ? n4.deleteInDirection(t3) : void 0) !== false ? this.setInputSummary({ didDelete: true }) : e3 ? (e3.preventDefault(), this.requestRender()) : void 0;
              }, s3.prototype.serializeSelectionToDataTransfer = function(t3) {
                var n4, i3;
                if (o2(t3))
                  return n4 = (i3 = this.responder) != null ? i3.getSelectedDocument().toSerializableDocument() : void 0, t3.setData("application/x-trix-document", JSON.stringify(n4)), t3.setData("text/html", e2.DocumentView.render(n4).innerHTML), t3.setData("text/plain", n4.toString().replace(/\n$/, "")), true;
              }, s3.prototype.canAcceptDataTransfer = function(t3) {
                var e3, n4, i3, o3, r3, s4;
                for (s4 = {}, o3 = (i3 = t3 != null ? t3.types : void 0) != null ? i3 : [], e3 = 0, n4 = o3.length; n4 > e3; e3++)
                  r3 = o3[e3], s4[r3] = true;
                return s4.Files || s4["application/x-trix-document"] || s4["text/html"] || s4["text/plain"];
              }, s3.prototype.getPastedHTMLUsingHiddenElement = function(t3) {
                var n4, i3, o3;
                return i3 = this.getSelectedRange(), o3 = { position: "absolute", left: window.pageXOffset + "px", top: window.pageYOffset + "px", opacity: 0 }, n4 = c({ style: o3, tagName: "div", editable: true }), document.body.appendChild(n4), n4.focus(), requestAnimationFrame(function(o4) {
                  return function() {
                    var r3;
                    return r3 = n4.innerHTML, e2.removeNode(n4), o4.setSelectedRange(i3), t3(r3);
                  };
                }(this));
              }, s3.proxyMethod("responder?.getSelectedRange"), s3.proxyMethod("responder?.setSelectedRange"), s3.proxyMethod("responder?.expandSelectionInDirection"), s3.proxyMethod("responder?.selectionIsInCursorTarget"), s3.proxyMethod("responder?.selectionIsExpanded"), s3;
            }(e2.InputController), r2 = function(t3) {
              var e3, n3;
              return (e3 = t3.type) != null && (n3 = e3.match(/\/(\w+)$/)) != null ? n3[1] : void 0;
            }, s2 = (typeof " ".codePointAt == "function" ? " ".codePointAt(0) : void 0) != null, p = function(t3) {
              var n3;
              return t3.key && s2 && t3.key.codePointAt(0) === t3.keyCode ? t3.key : (t3.which === null ? n3 = t3.keyCode : t3.which !== 0 && t3.charCode !== 0 && (n3 = t3.charCode), n3 != null && u[n3] !== "escape" ? e2.UTF16String.fromCodepoints([n3]).toString() : void 0);
            }, h2 = function(t3) {
              var e3, n3, i3, o3, r3, s3, a3, u2, c2, l3;
              if (u2 = t3.clipboardData) {
                if (m.call(u2.types, "text/html") >= 0) {
                  for (c2 = u2.types, i3 = 0, s3 = c2.length; s3 > i3; i3++)
                    if (l3 = c2[i3], e3 = /^CorePasteboardFlavorType/.test(l3), n3 = /^dyn\./.test(l3) && u2.getData(l3), a3 = e3 || n3)
                      return true;
                  return false;
                }
                return o3 = m.call(u2.types, "com.apple.webarchive") >= 0, r3 = m.call(u2.types, "com.apple.flat-rtfd") >= 0, o3 || r3;
              }
            }, t2 = function(t3) {
              function e3(t4) {
                var e4;
                this.inputController = t4, e4 = this.inputController, this.responder = e4.responder, this.delegate = e4.delegate, this.inputSummary = e4.inputSummary, this.data = {};
              }
              return f(e3, t3), e3.prototype.start = function(t4) {
                var e4, n3;
                return this.data.start = t4, this.isSignificant() ? (this.inputSummary.eventName === "keypress" && this.inputSummary.textAdded && (e4 = this.responder) != null && e4.deleteInDirection("left"), this.selectionIsExpanded() || (this.insertPlaceholder(), this.requestRender()), this.range = (n3 = this.responder) != null ? n3.getSelectedRange() : void 0) : void 0;
              }, e3.prototype.update = function(t4) {
                var e4;
                return this.data.update = t4, this.isSignificant() && (e4 = this.selectPlaceholder()) ? (this.forgetPlaceholder(), this.range = e4) : void 0;
              }, e3.prototype.end = function(t4) {
                var e4, n3, i3, o3;
                return this.data.end = t4, this.isSignificant() ? (this.forgetPlaceholder(), this.canApplyToDocument() ? (this.setInputSummary({ preferDocument: true, didInput: false }), (e4 = this.delegate) != null && e4.inputControllerWillPerformTyping(), (n3 = this.responder) != null && n3.setSelectedRange(this.range), (i3 = this.responder) != null && i3.insertString(this.data.end), (o3 = this.responder) != null ? o3.setSelectedRange(this.range[0] + this.data.end.length) : void 0) : this.data.start != null || this.data.update != null ? (this.requestReparse(), this.inputController.reset()) : void 0) : this.inputController.reset();
              }, e3.prototype.getEndData = function() {
                return this.data.end;
              }, e3.prototype.isEnded = function() {
                return this.getEndData() != null;
              }, e3.prototype.isSignificant = function() {
                return n2.composesExistingText ? this.inputSummary.didInput : true;
              }, e3.prototype.canApplyToDocument = function() {
                var t4, e4;
                return ((t4 = this.data.start) != null ? t4.length : void 0) === 0 && ((e4 = this.data.end) != null ? e4.length : void 0) > 0 && this.range != null;
              }, e3.proxyMethod("inputController.setInputSummary"), e3.proxyMethod("inputController.requestRender"), e3.proxyMethod("inputController.requestReparse"), e3.proxyMethod("responder?.selectionIsExpanded"), e3.proxyMethod("responder?.insertPlaceholder"), e3.proxyMethod("responder?.selectPlaceholder"), e3.proxyMethod("responder?.forgetPlaceholder"), e3;
            }(e2.BasicObject);
          }.call(this), function() {
            var t2, n2, i2, o2 = function(t3, e3) {
              return function() {
                return t3.apply(e3, arguments);
              };
            }, r2 = function(t3, e3) {
              function n3() {
                this.constructor = t3;
              }
              for (var i3 in e3)
                s2.call(e3, i3) && (t3[i3] = e3[i3]);
              return n3.prototype = e3.prototype, t3.prototype = new n3(), t3.__super__ = e3.prototype, t3;
            }, s2 = {}.hasOwnProperty, a2 = [].indexOf || function(t3) {
              for (var e3 = 0, n3 = this.length; n3 > e3; e3++)
                if (e3 in this && this[e3] === t3)
                  return e3;
              return -1;
            };
            t2 = e2.dataTransferIsPlainText, n2 = e2.keyEventIsKeyboardCommand, i2 = e2.objectsAreEqual, e2.Level2InputController = function(s3) {
              function u() {
                return this.render = o2(this.render, this), u.__super__.constructor.apply(this, arguments);
              }
              var c, l2, h2, p, d, f;
              return r2(u, s3), u.prototype.elementDidMutate = function() {
                var t3;
                return this.scheduledRender ? this.composing && (t3 = this.delegate) != null && typeof t3.inputControllerDidAllowUnhandledInput == "function" ? t3.inputControllerDidAllowUnhandledInput() : void 0 : this.reparse();
              }, u.prototype.scheduleRender = function() {
                return this.scheduledRender != null ? this.scheduledRender : this.scheduledRender = requestAnimationFrame(this.render);
              }, u.prototype.render = function() {
                var t3;
                return cancelAnimationFrame(this.scheduledRender), this.scheduledRender = null, this.composing || (t3 = this.delegate) != null && t3.render(), typeof this.afterRender == "function" && this.afterRender(), this.afterRender = null;
              }, u.prototype.reparse = function() {
                var t3;
                return (t3 = this.delegate) != null ? t3.reparse() : void 0;
              }, u.prototype.events = { keydown: function(t3) {
                var e3, i3, o3, r3;
                if (n2(t3)) {
                  if (e3 = l2(t3), (r3 = this.delegate) != null ? r3.inputControllerDidReceiveKeyboardCommand(e3) : void 0)
                    return t3.preventDefault();
                } else if (o3 = t3.key, t3.altKey && (o3 += "+Alt"), t3.shiftKey && (o3 += "+Shift"), i3 = this.keys[o3])
                  return this.withEvent(t3, i3);
              }, paste: function(t3) {
                var e3, n3, i3, o3, r3, s4, a3, u2, c2;
                return h2(t3) ? (t3.preventDefault(), this.attachFiles(t3.clipboardData.files)) : p(t3) ? (t3.preventDefault(), n3 = { type: "text/plain", string: t3.clipboardData.getData("text/plain") }, (i3 = this.delegate) != null && i3.inputControllerWillPaste(n3), (o3 = this.responder) != null && o3.insertString(n3.string), this.render(), (r3 = this.delegate) != null ? r3.inputControllerDidPaste(n3) : void 0) : (e3 = (s4 = t3.clipboardData) != null ? s4.getData("URL") : void 0) ? (t3.preventDefault(), n3 = { type: "text/html", html: this.createLinkHTML(e3) }, (a3 = this.delegate) != null && a3.inputControllerWillPaste(n3), (u2 = this.responder) != null && u2.insertHTML(n3.html), this.render(), (c2 = this.delegate) != null ? c2.inputControllerDidPaste(n3) : void 0) : void 0;
              }, beforeinput: function(t3) {
                var e3;
                return (e3 = this.inputTypes[t3.inputType]) ? (this.withEvent(t3, e3), this.scheduleRender()) : void 0;
              }, input: function() {
                return e2.selectionChangeObserver.reset();
              }, dragstart: function(t3) {
                var e3, n3;
                return ((e3 = this.responder) != null ? e3.selectionContainsAttachments() : void 0) ? (t3.dataTransfer.setData("application/x-trix-dragging", true), this.dragging = { range: (n3 = this.responder) != null ? n3.getSelectedRange() : void 0, point: d(t3) }) : void 0;
              }, dragenter: function(t3) {
                return c(t3) ? t3.preventDefault() : void 0;
              }, dragover: function(t3) {
                var e3, n3;
                if (this.dragging) {
                  if (t3.preventDefault(), e3 = d(t3), !i2(e3, this.dragging.point))
                    return this.dragging.point = e3, (n3 = this.responder) != null ? n3.setLocationRangeFromPointRange(e3) : void 0;
                } else if (c(t3))
                  return t3.preventDefault();
              }, drop: function(t3) {
                var e3, n3, i3, o3;
                return this.dragging ? (t3.preventDefault(), (n3 = this.delegate) != null && n3.inputControllerWillMoveText(), (i3 = this.responder) != null && i3.moveTextFromRange(this.dragging.range), this.dragging = null, this.scheduleRender()) : c(t3) ? (t3.preventDefault(), e3 = d(t3), (o3 = this.responder) != null && o3.setLocationRangeFromPointRange(e3), this.attachFiles(t3.dataTransfer.files)) : void 0;
              }, dragend: function() {
                var t3;
                return this.dragging ? ((t3 = this.responder) != null && t3.setSelectedRange(this.dragging.range), this.dragging = null) : void 0;
              }, compositionend: function() {
                return this.composing ? (this.composing = false, this.scheduleRender()) : void 0;
              } }, u.prototype.keys = { ArrowLeft: function() {
                var t3, e3;
                return ((t3 = this.responder) != null ? t3.shouldManageMovingCursorInDirection("backward") : void 0) ? (this.event.preventDefault(), (e3 = this.responder) != null ? e3.moveCursorInDirection("backward") : void 0) : void 0;
              }, ArrowRight: function() {
                var t3, e3;
                return ((t3 = this.responder) != null ? t3.shouldManageMovingCursorInDirection("forward") : void 0) ? (this.event.preventDefault(), (e3 = this.responder) != null ? e3.moveCursorInDirection("forward") : void 0) : void 0;
              }, Backspace: function() {
                var t3, e3, n3;
                return ((t3 = this.responder) != null ? t3.shouldManageDeletingInDirection("backward") : void 0) ? (this.event.preventDefault(), (e3 = this.delegate) != null && e3.inputControllerWillPerformTyping(), (n3 = this.responder) != null && n3.deleteInDirection("backward"), this.render()) : void 0;
              }, Tab: function() {
                var t3, e3;
                return ((t3 = this.responder) != null ? t3.canIncreaseNestingLevel() : void 0) ? (this.event.preventDefault(), (e3 = this.responder) != null && e3.increaseNestingLevel(), this.render()) : void 0;
              }, "Tab+Shift": function() {
                var t3, e3;
                return ((t3 = this.responder) != null ? t3.canDecreaseNestingLevel() : void 0) ? (this.event.preventDefault(), (e3 = this.responder) != null && e3.decreaseNestingLevel(), this.render()) : void 0;
              } }, u.prototype.inputTypes = { deleteByComposition: function() {
                return this.deleteInDirection("backward", { recordUndoEntry: false });
              }, deleteByCut: function() {
                return this.deleteInDirection("backward");
              }, deleteByDrag: function() {
                return this.event.preventDefault(), this.withTargetDOMRange(function() {
                  var t3;
                  return this.deleteByDragRange = (t3 = this.responder) != null ? t3.getSelectedRange() : void 0;
                });
              }, deleteCompositionText: function() {
                return this.deleteInDirection("backward", { recordUndoEntry: false });
              }, deleteContent: function() {
                return this.deleteInDirection("backward");
              }, deleteContentBackward: function() {
                return this.deleteInDirection("backward");
              }, deleteContentForward: function() {
                return this.deleteInDirection("forward");
              }, deleteEntireSoftLine: function() {
                return this.deleteInDirection("forward");
              }, deleteHardLineBackward: function() {
                return this.deleteInDirection("backward");
              }, deleteHardLineForward: function() {
                return this.deleteInDirection("forward");
              }, deleteSoftLineBackward: function() {
                return this.deleteInDirection("backward");
              }, deleteSoftLineForward: function() {
                return this.deleteInDirection("forward");
              }, deleteWordBackward: function() {
                return this.deleteInDirection("backward");
              }, deleteWordForward: function() {
                return this.deleteInDirection("forward");
              }, formatBackColor: function() {
                return this.activateAttributeIfSupported("backgroundColor", this.event.data);
              }, formatBold: function() {
                return this.toggleAttributeIfSupported("bold");
              }, formatFontColor: function() {
                return this.activateAttributeIfSupported("color", this.event.data);
              }, formatFontName: function() {
                return this.activateAttributeIfSupported("font", this.event.data);
              }, formatIndent: function() {
                var t3;
                return ((t3 = this.responder) != null ? t3.canIncreaseNestingLevel() : void 0) ? this.withTargetDOMRange(function() {
                  var t4;
                  return (t4 = this.responder) != null ? t4.increaseNestingLevel() : void 0;
                }) : void 0;
              }, formatItalic: function() {
                return this.toggleAttributeIfSupported("italic");
              }, formatJustifyCenter: function() {
                return this.toggleAttributeIfSupported("justifyCenter");
              }, formatJustifyFull: function() {
                return this.toggleAttributeIfSupported("justifyFull");
              }, formatJustifyLeft: function() {
                return this.toggleAttributeIfSupported("justifyLeft");
              }, formatJustifyRight: function() {
                return this.toggleAttributeIfSupported("justifyRight");
              }, formatOutdent: function() {
                var t3;
                return ((t3 = this.responder) != null ? t3.canDecreaseNestingLevel() : void 0) ? this.withTargetDOMRange(function() {
                  var t4;
                  return (t4 = this.responder) != null ? t4.decreaseNestingLevel() : void 0;
                }) : void 0;
              }, formatRemove: function() {
                return this.withTargetDOMRange(function() {
                  var t3, e3, n3, i3;
                  i3 = [];
                  for (t3 in (e3 = this.responder) != null ? e3.getCurrentAttributes() : void 0)
                    i3.push((n3 = this.responder) != null ? n3.removeCurrentAttribute(t3) : void 0);
                  return i3;
                });
              }, formatSetBlockTextDirection: function() {
                return this.activateAttributeIfSupported("blockDir", this.event.data);
              }, formatSetInlineTextDirection: function() {
                return this.activateAttributeIfSupported("textDir", this.event.data);
              }, formatStrikeThrough: function() {
                return this.toggleAttributeIfSupported("strike");
              }, formatSubscript: function() {
                return this.toggleAttributeIfSupported("sub");
              }, formatSuperscript: function() {
                return this.toggleAttributeIfSupported("sup");
              }, formatUnderline: function() {
                return this.toggleAttributeIfSupported("underline");
              }, historyRedo: function() {
                var t3;
                return (t3 = this.delegate) != null ? t3.inputControllerWillPerformRedo() : void 0;
              }, historyUndo: function() {
                var t3;
                return (t3 = this.delegate) != null ? t3.inputControllerWillPerformUndo() : void 0;
              }, insertCompositionText: function() {
                return this.composing = true, this.insertString(this.event.data);
              }, insertFromComposition: function() {
                return this.composing = false, this.insertString(this.event.data);
              }, insertFromDrop: function() {
                var t3, e3;
                return (t3 = this.deleteByDragRange) ? (this.deleteByDragRange = null, (e3 = this.delegate) != null && e3.inputControllerWillMoveText(), this.withTargetDOMRange(function() {
                  var e4;
                  return (e4 = this.responder) != null ? e4.moveTextFromRange(t3) : void 0;
                })) : void 0;
              }, insertFromPaste: function() {
                var n3, i3, o3, r3, s4, a3, u2, c2, l3, h3, p2;
                return n3 = this.event.dataTransfer, s4 = { dataTransfer: n3 }, (i3 = n3.getData("URL")) ? (this.event.preventDefault(), s4.type = "text/html", p2 = (r3 = n3.getData("public.url-name")) ? e2.squishBreakableWhitespace(r3).trim() : i3, s4.html = this.createLinkHTML(i3, p2), (a3 = this.delegate) != null && a3.inputControllerWillPaste(s4), this.withTargetDOMRange(function() {
                  var t3;
                  return (t3 = this.responder) != null ? t3.insertHTML(s4.html) : void 0;
                }), this.afterRender = function(t3) {
                  return function() {
                    var e3;
                    return (e3 = t3.delegate) != null ? e3.inputControllerDidPaste(s4) : void 0;
                  };
                }(this)) : t2(n3) ? (s4.type = "text/plain", s4.string = n3.getData("text/plain"), (u2 = this.delegate) != null && u2.inputControllerWillPaste(s4), this.withTargetDOMRange(function() {
                  var t3;
                  return (t3 = this.responder) != null ? t3.insertString(s4.string) : void 0;
                }), this.afterRender = function(t3) {
                  return function() {
                    var e3;
                    return (e3 = t3.delegate) != null ? e3.inputControllerDidPaste(s4) : void 0;
                  };
                }(this)) : (o3 = n3.getData("text/html")) ? (this.event.preventDefault(), s4.type = "text/html", s4.html = o3, (c2 = this.delegate) != null && c2.inputControllerWillPaste(s4), this.withTargetDOMRange(function() {
                  var t3;
                  return (t3 = this.responder) != null ? t3.insertHTML(s4.html) : void 0;
                }), this.afterRender = function(t3) {
                  return function() {
                    var e3;
                    return (e3 = t3.delegate) != null ? e3.inputControllerDidPaste(s4) : void 0;
                  };
                }(this)) : ((l3 = n3.files) != null ? l3.length : void 0) ? (s4.type = "File", s4.file = n3.files[0], (h3 = this.delegate) != null && h3.inputControllerWillPaste(s4), this.withTargetDOMRange(function() {
                  var t3;
                  return (t3 = this.responder) != null ? t3.insertFile(s4.file) : void 0;
                }), this.afterRender = function(t3) {
                  return function() {
                    var e3;
                    return (e3 = t3.delegate) != null ? e3.inputControllerDidPaste(s4) : void 0;
                  };
                }(this)) : void 0;
              }, insertFromYank: function() {
                return this.insertString(this.event.data);
              }, insertLineBreak: function() {
                return this.insertString("\n");
              }, insertLink: function() {
                return this.activateAttributeIfSupported("href", this.event.data);
              }, insertOrderedList: function() {
                return this.toggleAttributeIfSupported("number");
              }, insertParagraph: function() {
                var t3;
                return (t3 = this.delegate) != null && t3.inputControllerWillPerformTyping(), this.withTargetDOMRange(function() {
                  var t4;
                  return (t4 = this.responder) != null ? t4.insertLineBreak() : void 0;
                });
              }, insertReplacementText: function() {
                return this.insertString(this.event.dataTransfer.getData("text/plain"), { updatePosition: false });
              }, insertText: function() {
                var t3, e3;
                return this.insertString((t3 = this.event.data) != null ? t3 : (e3 = this.event.dataTransfer) != null ? e3.getData("text/plain") : void 0);
              }, insertTranspose: function() {
                return this.insertString(this.event.data);
              }, insertUnorderedList: function() {
                return this.toggleAttributeIfSupported("bullet");
              } }, u.prototype.insertString = function(t3, e3) {
                var n3;
                return t3 == null && (t3 = ""), (n3 = this.delegate) != null && n3.inputControllerWillPerformTyping(), this.withTargetDOMRange(function() {
                  var n4;
                  return (n4 = this.responder) != null ? n4.insertString(t3, e3) : void 0;
                });
              }, u.prototype.toggleAttributeIfSupported = function(t3) {
                var n3;
                return a2.call(e2.getAllAttributeNames(), t3) >= 0 ? ((n3 = this.delegate) != null && n3.inputControllerWillPerformFormatting(t3), this.withTargetDOMRange(function() {
                  var e3;
                  return (e3 = this.responder) != null ? e3.toggleCurrentAttribute(t3) : void 0;
                })) : void 0;
              }, u.prototype.activateAttributeIfSupported = function(t3, n3) {
                var i3;
                return a2.call(e2.getAllAttributeNames(), t3) >= 0 ? ((i3 = this.delegate) != null && i3.inputControllerWillPerformFormatting(t3), this.withTargetDOMRange(function() {
                  var e3;
                  return (e3 = this.responder) != null ? e3.setCurrentAttribute(t3, n3) : void 0;
                })) : void 0;
              }, u.prototype.deleteInDirection = function(t3, e3) {
                var n3, i3, o3, r3;
                return o3 = (e3 != null ? e3 : { recordUndoEntry: true }).recordUndoEntry, o3 && (r3 = this.delegate) != null && r3.inputControllerWillPerformTyping(), i3 = function(e4) {
                  return function() {
                    var n4;
                    return (n4 = e4.responder) != null ? n4.deleteInDirection(t3) : void 0;
                  };
                }(this), (n3 = this.getTargetDOMRange({ minLength: 2 })) ? this.withTargetDOMRange(n3, i3) : i3();
              }, u.prototype.withTargetDOMRange = function(t3, n3) {
                var i3;
                return typeof t3 == "function" && (n3 = t3, t3 = this.getTargetDOMRange()), t3 ? (i3 = this.responder) != null ? i3.withTargetDOMRange(t3, n3.bind(this)) : void 0 : (e2.selectionChangeObserver.reset(), n3.call(this));
              }, u.prototype.getTargetDOMRange = function(t3) {
                var e3, n3, i3, o3;
                return i3 = (t3 != null ? t3 : { minLength: 0 }).minLength, (o3 = typeof (e3 = this.event).getTargetRanges == "function" ? e3.getTargetRanges() : void 0) && o3.length && (n3 = f(o3[0]), i3 === 0 || n3.toString().length >= i3) ? n3 : void 0;
              }, f = function(t3) {
                var e3;
                return e3 = document.createRange(), e3.setStart(t3.startContainer, t3.startOffset), e3.setEnd(t3.endContainer, t3.endOffset), e3;
              }, u.prototype.withEvent = function(t3, e3) {
                var n3;
                this.event = t3;
                try {
                  n3 = e3.call(this);
                } finally {
                  this.event = null;
                }
                return n3;
              }, c = function(t3) {
                var e3, n3;
                return a2.call((e3 = (n3 = t3.dataTransfer) != null ? n3.types : void 0) != null ? e3 : [], "Files") >= 0;
              }, h2 = function(t3) {
                var e3;
                return (e3 = t3.clipboardData) ? a2.call(e3.types, "Files") >= 0 && e3.types.length === 1 && e3.files.length >= 1 : void 0;
              }, p = function(t3) {
                var e3;
                return (e3 = t3.clipboardData) ? a2.call(e3.types, "text/plain") >= 0 && e3.types.length === 1 : void 0;
              }, l2 = function(t3) {
                var e3;
                return e3 = [], t3.altKey && e3.push("alt"), t3.shiftKey && e3.push("shift"), e3.push(t3.key), e3;
              }, d = function(t3) {
                return { x: t3.clientX, y: t3.clientY };
              }, u;
            }(e2.InputController);
          }.call(this), function() {
            var t2, n2, i2, o2, r2, s2, a2, u, c = function(t3, e3) {
              return function() {
                return t3.apply(e3, arguments);
              };
            }, l2 = function(t3, e3) {
              function n3() {
                this.constructor = t3;
              }
              for (var i3 in e3)
                h2.call(e3, i3) && (t3[i3] = e3[i3]);
              return n3.prototype = e3.prototype, t3.prototype = new n3(), t3.__super__ = e3.prototype, t3;
            }, h2 = {}.hasOwnProperty;
            n2 = e2.defer, i2 = e2.handleEvent, s2 = e2.makeElement, u = e2.tagName, a2 = e2.config, r2 = a2.lang, t2 = a2.css, o2 = a2.keyNames, e2.AttachmentEditorController = function(a3) {
              function h3(t3, e3, n3, i3) {
                this.attachmentPiece = t3, this.element = e3, this.container = n3, this.options = i3 != null ? i3 : {}, this.didBlurCaption = c(this.didBlurCaption, this), this.didChangeCaption = c(this.didChangeCaption, this), this.didInputCaption = c(this.didInputCaption, this), this.didKeyDownCaption = c(this.didKeyDownCaption, this), this.didClickActionButton = c(this.didClickActionButton, this), this.didClickToolbar = c(this.didClickToolbar, this), this.attachment = this.attachmentPiece.attachment, u(this.element) === "a" && (this.element = this.element.firstChild), this.install();
              }
              var p;
              return l2(h3, a3), p = function(t3) {
                return function() {
                  var e3;
                  return e3 = t3.apply(this, arguments), e3["do"](), this.undos == null && (this.undos = []), this.undos.push(e3.undo);
                };
              }, h3.prototype.install = function() {
                return this.makeElementMutable(), this.addToolbar(), this.attachment.isPreviewable() ? this.installCaptionEditor() : void 0;
              }, h3.prototype.uninstall = function() {
                var t3, e3;
                for (this.savePendingCaption(); e3 = this.undos.pop(); )
                  e3();
                return (t3 = this.delegate) != null ? t3.didUninstallAttachmentEditor(this) : void 0;
              }, h3.prototype.savePendingCaption = function() {
                var t3, e3, n3;
                return this.pendingCaption != null ? (t3 = this.pendingCaption, this.pendingCaption = null, t3 ? (e3 = this.delegate) != null && typeof e3.attachmentEditorDidRequestUpdatingAttributesForAttachment == "function" ? e3.attachmentEditorDidRequestUpdatingAttributesForAttachment({ caption: t3 }, this.attachment) : void 0 : (n3 = this.delegate) != null && typeof n3.attachmentEditorDidRequestRemovingAttributeForAttachment == "function" ? n3.attachmentEditorDidRequestRemovingAttributeForAttachment("caption", this.attachment) : void 0) : void 0;
              }, h3.prototype.makeElementMutable = p(function() {
                return { "do": function(t3) {
                  return function() {
                    return t3.element.dataset.trixMutable = true;
                  };
                }(this), undo: function(t3) {
                  return function() {
                    return delete t3.element.dataset.trixMutable;
                  };
                }(this) };
              }), h3.prototype.addToolbar = p(function() {
                var n3;
                return n3 = s2({ tagName: "div", className: t2.attachmentToolbar, data: { trixMutable: true }, childNodes: s2({ tagName: "div", className: "trix-button-row", childNodes: s2({ tagName: "span", className: "trix-button-group trix-button-group--actions", childNodes: s2({ tagName: "button", className: "trix-button trix-button--remove", textContent: r2.remove, attributes: { title: r2.remove }, data: { trixAction: "remove" } }) }) }) }), this.attachment.isPreviewable() && n3.appendChild(s2({ tagName: "div", className: t2.attachmentMetadataContainer, childNodes: s2({ tagName: "span", className: t2.attachmentMetadata, childNodes: [s2({ tagName: "span", className: t2.attachmentName, textContent: this.attachment.getFilename(), attributes: { title: this.attachment.getFilename() } }), s2({ tagName: "span", className: t2.attachmentSize, textContent: this.attachment.getFormattedFilesize() })] }) })), i2("click", { onElement: n3, withCallback: this.didClickToolbar }), i2("click", { onElement: n3, matchingSelector: "[data-trix-action]", withCallback: this.didClickActionButton }), { "do": function(t3) {
                  return function() {
                    return t3.element.appendChild(n3);
                  };
                }(this), undo: function() {
                  return function() {
                    return e2.removeNode(n3);
                  };
                }(this) };
              }), h3.prototype.installCaptionEditor = p(function() {
                var o3, a4, u2, c2, l3;
                return c2 = s2({ tagName: "textarea", className: t2.attachmentCaptionEditor, attributes: { placeholder: r2.captionPlaceholder }, data: { trixMutable: true } }), c2.value = this.attachmentPiece.getCaption(), l3 = c2.cloneNode(), l3.classList.add("trix-autoresize-clone"), l3.tabIndex = -1, o3 = function() {
                  return l3.value = c2.value, c2.style.height = l3.scrollHeight + "px";
                }, i2("input", { onElement: c2, withCallback: o3 }), i2("input", { onElement: c2, withCallback: this.didInputCaption }), i2("keydown", { onElement: c2, withCallback: this.didKeyDownCaption }), i2("change", { onElement: c2, withCallback: this.didChangeCaption }), i2("blur", { onElement: c2, withCallback: this.didBlurCaption }), u2 = this.element.querySelector("figcaption"), a4 = u2.cloneNode(), { "do": function(e3) {
                  return function() {
                    return u2.style.display = "none", a4.appendChild(c2), a4.appendChild(l3), a4.classList.add(t2.attachmentCaption + "--editing"), u2.parentElement.insertBefore(a4, u2), o3(), e3.options.editCaption ? n2(function() {
                      return c2.focus();
                    }) : void 0;
                  };
                }(this), undo: function() {
                  return e2.removeNode(a4), u2.style.display = null;
                } };
              }), h3.prototype.didClickToolbar = function(t3) {
                return t3.preventDefault(), t3.stopPropagation();
              }, h3.prototype.didClickActionButton = function(t3) {
                var e3, n3;
                switch (e3 = t3.target.getAttribute("data-trix-action")) {
                  case "remove":
                    return (n3 = this.delegate) != null ? n3.attachmentEditorDidRequestRemovalOfAttachment(this.attachment) : void 0;
                }
              }, h3.prototype.didKeyDownCaption = function(t3) {
                var e3;
                return o2[t3.keyCode] === "return" ? (t3.preventDefault(), this.savePendingCaption(), (e3 = this.delegate) != null && typeof e3.attachmentEditorDidRequestDeselectingAttachment == "function" ? e3.attachmentEditorDidRequestDeselectingAttachment(this.attachment) : void 0) : void 0;
              }, h3.prototype.didInputCaption = function(t3) {
                return this.pendingCaption = t3.target.value.replace(/\s/g, " ").trim();
              }, h3.prototype.didChangeCaption = function() {
                return this.savePendingCaption();
              }, h3.prototype.didBlurCaption = function() {
                return this.savePendingCaption();
              }, h3;
            }(e2.BasicObject);
          }.call(this), function() {
            var t2, n2, i2, o2 = function(t3, e3) {
              function n3() {
                this.constructor = t3;
              }
              for (var i3 in e3)
                r2.call(e3, i3) && (t3[i3] = e3[i3]);
              return n3.prototype = e3.prototype, t3.prototype = new n3(), t3.__super__ = e3.prototype, t3;
            }, r2 = {}.hasOwnProperty;
            i2 = e2.makeElement, t2 = e2.config.css, e2.AttachmentView = function(r3) {
              function s2() {
                s2.__super__.constructor.apply(this, arguments), this.attachment = this.object, this.attachment.uploadProgressDelegate = this, this.attachmentPiece = this.options.piece;
              }
              var a2;
              return o2(s2, r3), s2.attachmentSelector = "[data-trix-attachment]", s2.prototype.createContentNodes = function() {
                return [];
              }, s2.prototype.createNodes = function() {
                var e3, n3, o3, r4, s3, u, c;
                if (e3 = r4 = i2({ tagName: "figure", className: this.getClassName(), data: this.getData(), editable: false }), (n3 = this.getHref()) && (r4 = i2({ tagName: "a", editable: false, attributes: { href: n3, tabindex: -1 } }), e3.appendChild(r4)), this.attachment.hasContent())
                  r4.innerHTML = this.attachment.getContent();
                else
                  for (c = this.createContentNodes(), o3 = 0, s3 = c.length; s3 > o3; o3++)
                    u = c[o3], r4.appendChild(u);
                return r4.appendChild(this.createCaptionElement()), this.attachment.isPending() && (this.progressElement = i2({ tagName: "progress", attributes: { "class": t2.attachmentProgress, value: this.attachment.getUploadProgress(), max: 100 }, data: { trixMutable: true, trixStoreKey: ["progressElement", this.attachment.id].join("/") } }), e3.appendChild(this.progressElement)), [a2("left"), e3, a2("right")];
              }, s2.prototype.createCaptionElement = function() {
                var e3, n3, o3, r4, s3, a3, u;
                return o3 = i2({ tagName: "figcaption", className: t2.attachmentCaption }), (e3 = this.attachmentPiece.getCaption()) ? (o3.classList.add(t2.attachmentCaption + "--edited"), o3.textContent = e3) : (n3 = this.getCaptionConfig(), n3.name && (r4 = this.attachment.getFilename()), n3.size && (a3 = this.attachment.getFormattedFilesize()), r4 && (s3 = i2({ tagName: "span", className: t2.attachmentName, textContent: r4 }), o3.appendChild(s3)), a3 && (r4 && o3.appendChild(document.createTextNode(" ")), u = i2({ tagName: "span", className: t2.attachmentSize, textContent: a3 }), o3.appendChild(u))), o3;
              }, s2.prototype.getClassName = function() {
                var e3, n3;
                return n3 = [t2.attachment, t2.attachment + "--" + this.attachment.getType()], (e3 = this.attachment.getExtension()) && n3.push(t2.attachment + "--" + e3), n3.join(" ");
              }, s2.prototype.getData = function() {
                var t3, e3;
                return e3 = { trixAttachment: JSON.stringify(this.attachment), trixContentType: this.attachment.getContentType(), trixId: this.attachment.id }, t3 = this.attachmentPiece.attributes, t3.isEmpty() || (e3.trixAttributes = JSON.stringify(t3)), this.attachment.isPending() && (e3.trixSerialize = false), e3;
              }, s2.prototype.getHref = function() {
                return n2(this.attachment.getContent(), "a") ? void 0 : this.attachment.getHref();
              }, s2.prototype.getCaptionConfig = function() {
                var t3, n3, i3;
                return i3 = this.attachment.getType(), t3 = e2.copyObject((n3 = e2.config.attachments[i3]) != null ? n3.caption : void 0), i3 === "file" && (t3.name = true), t3;
              }, s2.prototype.findProgressElement = function() {
                var t3;
                return (t3 = this.findElement()) != null ? t3.querySelector("progress") : void 0;
              }, a2 = function(t3) {
                return i2({ tagName: "span", textContent: e2.ZERO_WIDTH_SPACE, data: { trixCursorTarget: t3, trixSerialize: false } });
              }, s2.prototype.attachmentDidChangeUploadProgress = function() {
                var t3, e3;
                return e3 = this.attachment.getUploadProgress(), (t3 = this.findProgressElement()) != null ? t3.value = e3 : void 0;
              }, s2;
            }(e2.ObjectView), n2 = function(t3, e3) {
              var n3;
              return n3 = i2("div"), n3.innerHTML = t3 != null ? t3 : "", n3.querySelector(e3);
            };
          }.call(this), function() {
            var t2, n2 = function(t3, e3) {
              function n3() {
                this.constructor = t3;
              }
              for (var o2 in e3)
                i2.call(e3, o2) && (t3[o2] = e3[o2]);
              return n3.prototype = e3.prototype, t3.prototype = new n3(), t3.__super__ = e3.prototype, t3;
            }, i2 = {}.hasOwnProperty;
            t2 = e2.makeElement, e2.PreviewableAttachmentView = function(i3) {
              function o2() {
                o2.__super__.constructor.apply(this, arguments), this.attachment.previewDelegate = this;
              }
              return n2(o2, i3), o2.prototype.createContentNodes = function() {
                return this.image = t2({ tagName: "img", attributes: { src: "" }, data: { trixMutable: true } }), this.refresh(this.image), [this.image];
              }, o2.prototype.createCaptionElement = function() {
                var t3;
                return t3 = o2.__super__.createCaptionElement.apply(this, arguments), t3.textContent || t3.setAttribute("data-trix-placeholder", e2.config.lang.captionPlaceholder), t3;
              }, o2.prototype.refresh = function(t3) {
                var e3;
                return t3 == null && (t3 = (e3 = this.findElement()) != null ? e3.querySelector("img") : void 0), t3 ? this.updateAttributesForImage(t3) : void 0;
              }, o2.prototype.updateAttributesForImage = function(t3) {
                var e3, n3, i4, o3, r2, s2;
                return r2 = this.attachment.getURL(), n3 = this.attachment.getPreviewURL(), t3.src = n3 || r2, n3 === r2 ? t3.removeAttribute("data-trix-serialized-attributes") : (i4 = JSON.stringify({ src: r2 }), t3.setAttribute("data-trix-serialized-attributes", i4)), s2 = this.attachment.getWidth(), e3 = this.attachment.getHeight(), s2 != null && (t3.width = s2), e3 != null && (t3.height = e3), o3 = ["imageElement", this.attachment.id, t3.src, t3.width, t3.height].join("/"), t3.dataset.trixStoreKey = o3;
              }, o2.prototype.attachmentDidChangeAttributes = function() {
                return this.refresh(this.image), this.refresh();
              }, o2;
            }(e2.AttachmentView);
          }.call(this), function() {
            var t2, n2, i2, o2 = function(t3, e3) {
              function n3() {
                this.constructor = t3;
              }
              for (var i3 in e3)
                r2.call(e3, i3) && (t3[i3] = e3[i3]);
              return n3.prototype = e3.prototype, t3.prototype = new n3(), t3.__super__ = e3.prototype, t3;
            }, r2 = {}.hasOwnProperty;
            i2 = e2.makeElement, t2 = e2.findInnerElement, n2 = e2.getTextConfig, e2.PieceView = function(r3) {
              function s2() {
                var t3;
                s2.__super__.constructor.apply(this, arguments), this.piece = this.object, this.attributes = this.piece.getAttributes(), t3 = this.options, this.textConfig = t3.textConfig, this.context = t3.context, this.piece.attachment ? this.attachment = this.piece.attachment : this.string = this.piece.toString();
              }
              var a2;
              return o2(s2, r3), s2.prototype.createNodes = function() {
                var e3, n3, i3, o3, r4, s3;
                if (s3 = this.attachment ? this.createAttachmentNodes() : this.createStringNodes(), e3 = this.createElement()) {
                  for (i3 = t2(e3), n3 = 0, o3 = s3.length; o3 > n3; n3++)
                    r4 = s3[n3], i3.appendChild(r4);
                  s3 = [e3];
                }
                return s3;
              }, s2.prototype.createAttachmentNodes = function() {
                var t3, n3;
                return t3 = this.attachment.isPreviewable() ? e2.PreviewableAttachmentView : e2.AttachmentView, n3 = this.createChildView(t3, this.piece.attachment, { piece: this.piece }), n3.getNodes();
              }, s2.prototype.createStringNodes = function() {
                var t3, e3, n3, o3, r4, s3, a3, u, c, l2;
                if ((u = this.textConfig) != null ? u.plaintext : void 0)
                  return [document.createTextNode(this.string)];
                for (a3 = [], c = this.string.split("\n"), n3 = e3 = 0, o3 = c.length; o3 > e3; n3 = ++e3)
                  l2 = c[n3], n3 > 0 && (t3 = i2("br"), a3.push(t3)), (r4 = l2.length) && (s3 = document.createTextNode(this.preserveSpaces(l2)), a3.push(s3));
                return a3;
              }, s2.prototype.createElement = function() {
                var t3, e3, o3, r4, s3, a3, u, c, l2;
                c = {}, a3 = this.attributes;
                for (r4 in a3)
                  if (l2 = a3[r4], (t3 = n2(r4)) && (t3.tagName && (s3 = i2(t3.tagName), o3 ? (o3.appendChild(s3), o3 = s3) : e3 = o3 = s3), t3.styleProperty && (c[t3.styleProperty] = l2), t3.style)) {
                    u = t3.style;
                    for (r4 in u)
                      l2 = u[r4], c[r4] = l2;
                  }
                if (Object.keys(c).length) {
                  e3 == null && (e3 = i2("span"));
                  for (r4 in c)
                    l2 = c[r4], e3.style[r4] = l2;
                }
                return e3;
              }, s2.prototype.createContainerElement = function() {
                var t3, e3, o3, r4, s3;
                r4 = this.attributes;
                for (o3 in r4)
                  if (s3 = r4[o3], (e3 = n2(o3)) && e3.groupTagName)
                    return t3 = {}, t3[o3] = s3, i2(e3.groupTagName, t3);
              }, a2 = e2.NON_BREAKING_SPACE, s2.prototype.preserveSpaces = function(t3) {
                return this.context.isLast && (t3 = t3.replace(/\ $/, a2)), t3 = t3.replace(/(\S)\ {3}(\S)/g, "$1 " + a2 + " $2").replace(/\ {2}/g, a2 + " ").replace(/\ {2}/g, " " + a2), (this.context.isFirst || this.context.followsWhitespace) && (t3 = t3.replace(/^\ /, a2)), t3;
              }, s2;
            }(e2.ObjectView);
          }.call(this), function() {
            var t2 = function(t3, e3) {
              function i2() {
                this.constructor = t3;
              }
              for (var o2 in e3)
                n2.call(e3, o2) && (t3[o2] = e3[o2]);
              return i2.prototype = e3.prototype, t3.prototype = new i2(), t3.__super__ = e3.prototype, t3;
            }, n2 = {}.hasOwnProperty;
            e2.TextView = function(n3) {
              function i2() {
                i2.__super__.constructor.apply(this, arguments), this.text = this.object, this.textConfig = this.options.textConfig;
              }
              var o2;
              return t2(i2, n3), i2.prototype.createNodes = function() {
                var t3, n4, i3, r2, s2, a2, u, c, l2, h2;
                for (a2 = [], c = e2.ObjectGroup.groupObjects(this.getPieces()), r2 = c.length - 1, i3 = n4 = 0, s2 = c.length; s2 > n4; i3 = ++n4)
                  u = c[i3], t3 = {}, i3 === 0 && (t3.isFirst = true), i3 === r2 && (t3.isLast = true), o2(l2) && (t3.followsWhitespace = true), h2 = this.findOrCreateCachedChildView(e2.PieceView, u, { textConfig: this.textConfig, context: t3 }), a2.push.apply(a2, h2.getNodes()), l2 = u;
                return a2;
              }, i2.prototype.getPieces = function() {
                var t3, e3, n4, i3, o3;
                for (i3 = this.text.getPieces(), o3 = [], t3 = 0, e3 = i3.length; e3 > t3; t3++)
                  n4 = i3[t3], n4.hasAttribute("blockBreak") || o3.push(n4);
                return o3;
              }, o2 = function(t3) {
                return /\s$/.test(t3 != null ? t3.toString() : void 0);
              }, i2;
            }(e2.ObjectView);
          }.call(this), function() {
            var t2, n2, i2, o2 = function(t3, e3) {
              function n3() {
                this.constructor = t3;
              }
              for (var i3 in e3)
                r2.call(e3, i3) && (t3[i3] = e3[i3]);
              return n3.prototype = e3.prototype, t3.prototype = new n3(), t3.__super__ = e3.prototype, t3;
            }, r2 = {}.hasOwnProperty;
            i2 = e2.makeElement, n2 = e2.getBlockConfig, t2 = e2.config.css, e2.BlockView = function(r3) {
              function s2() {
                s2.__super__.constructor.apply(this, arguments), this.block = this.object, this.attributes = this.block.getAttributes();
              }
              return o2(s2, r3), s2.prototype.createNodes = function() {
                var t3, o3, r4, s3, a2, u, c, l2, h2, p, d;
                if (o3 = document.createComment("block"), c = [o3], this.block.isEmpty() ? c.push(i2("br")) : (p = (l2 = n2(this.block.getLastAttribute())) != null ? l2.text : void 0, d = this.findOrCreateCachedChildView(e2.TextView, this.block.text, { textConfig: p }), c.push.apply(c, d.getNodes()), this.shouldAddExtraNewlineElement() && c.push(i2("br"))), this.attributes.length)
                  return c;
                for (h2 = e2.config.blockAttributes["default"].tagName, this.block.isRTL() && (t3 = { dir: "rtl" }), r4 = i2({ tagName: h2, attributes: t3 }), s3 = 0, a2 = c.length; a2 > s3; s3++)
                  u = c[s3], r4.appendChild(u);
                return [r4];
              }, s2.prototype.createContainerElement = function(e3) {
                var o3, r4, s3, a2, u;
                return o3 = this.attributes[e3], u = n2(o3).tagName, e3 === 0 && this.block.isRTL() && (r4 = { dir: "rtl" }), o3 === "attachmentGallery" && (a2 = this.block.getBlockBreakPosition(), s3 = t2.attachmentGallery + " " + t2.attachmentGallery + "--" + a2), i2({ tagName: u, className: s3, attributes: r4 });
              }, s2.prototype.shouldAddExtraNewlineElement = function() {
                return /\n\n$/.test(this.block.toString());
              }, s2;
            }(e2.ObjectView);
          }.call(this), function() {
            var t2, n2, i2 = function(t3, e3) {
              function n3() {
                this.constructor = t3;
              }
              for (var i3 in e3)
                o2.call(e3, i3) && (t3[i3] = e3[i3]);
              return n3.prototype = e3.prototype, t3.prototype = new n3(), t3.__super__ = e3.prototype, t3;
            }, o2 = {}.hasOwnProperty;
            t2 = e2.defer, n2 = e2.makeElement, e2.DocumentView = function(o3) {
              function r2() {
                r2.__super__.constructor.apply(this, arguments), this.element = this.options.element, this.elementStore = new e2.ElementStore(), this.setDocument(this.object);
              }
              var s2, a2, u;
              return i2(r2, o3), r2.render = function(t3) {
                var e3, i3;
                return e3 = n2("div"), i3 = new this(t3, { element: e3 }), i3.render(), i3.sync(), e3;
              }, r2.prototype.setDocument = function(t3) {
                return t3.isEqualTo(this.document) ? void 0 : this.document = this.object = t3;
              }, r2.prototype.render = function() {
                var t3, i3, o4, r3, s3, a3, u2;
                if (this.childViews = [], this.shadowElement = n2("div"), !this.document.isEmpty()) {
                  for (s3 = e2.ObjectGroup.groupObjects(this.document.getBlocks(), { asTree: true }), a3 = [], t3 = 0, i3 = s3.length; i3 > t3; t3++)
                    r3 = s3[t3], u2 = this.findOrCreateCachedChildView(e2.BlockView, r3), a3.push(function() {
                      var t4, e3, n3, i4;
                      for (n3 = u2.getNodes(), i4 = [], t4 = 0, e3 = n3.length; e3 > t4; t4++)
                        o4 = n3[t4], i4.push(this.shadowElement.appendChild(o4));
                      return i4;
                    }.call(this));
                  return a3;
                }
              }, r2.prototype.isSynced = function() {
                return s2(this.shadowElement, this.element);
              }, r2.prototype.sync = function() {
                var t3;
                for (t3 = this.createDocumentFragmentForSync(); this.element.lastChild; )
                  this.element.removeChild(this.element.lastChild);
                return this.element.appendChild(t3), this.didSync();
              }, r2.prototype.didSync = function() {
                return this.elementStore.reset(a2(this.element)), t2(function(t3) {
                  return function() {
                    return t3.garbageCollectCachedViews();
                  };
                }(this));
              }, r2.prototype.createDocumentFragmentForSync = function() {
                var t3, e3, n3, i3, o4, r3, s3, u2, c, l2;
                for (e3 = document.createDocumentFragment(), u2 = this.shadowElement.childNodes, n3 = 0, o4 = u2.length; o4 > n3; n3++)
                  s3 = u2[n3], e3.appendChild(s3.cloneNode(true));
                for (c = a2(e3), i3 = 0, r3 = c.length; r3 > i3; i3++)
                  t3 = c[i3], (l2 = this.elementStore.remove(t3)) && t3.parentNode.replaceChild(l2, t3);
                return e3;
              }, a2 = function(t3) {
                return t3.querySelectorAll("[data-trix-store-key]");
              }, s2 = function(t3, e3) {
                return u(t3.innerHTML) === u(e3.innerHTML);
              }, u = function(t3) {
                return t3.replace(/&nbsp;/g, " ");
              }, r2;
            }(e2.ObjectView);
          }.call(this), function() {
            var t2, n2, i2, o2, r2, s2 = function(t3, e3) {
              return function() {
                return t3.apply(e3, arguments);
              };
            }, a2 = function(t3, e3) {
              function n3() {
                this.constructor = t3;
              }
              for (var i3 in e3)
                u.call(e3, i3) && (t3[i3] = e3[i3]);
              return n3.prototype = e3.prototype, t3.prototype = new n3(), t3.__super__ = e3.prototype, t3;
            }, u = {}.hasOwnProperty;
            i2 = e2.findClosestElementFromNode, o2 = e2.handleEvent, r2 = e2.innerElementIsActive, n2 = e2.defer, t2 = e2.AttachmentView.attachmentSelector, e2.CompositionController = function(u2) {
              function c(n3, i3) {
                this.element = n3, this.composition = i3, this.didClickAttachment = s2(this.didClickAttachment, this), this.didBlur = s2(this.didBlur, this), this.didFocus = s2(this.didFocus, this), this.documentView = new e2.DocumentView(this.composition.document, { element: this.element }), o2("focus", { onElement: this.element, withCallback: this.didFocus }), o2("blur", { onElement: this.element, withCallback: this.didBlur }), o2("click", { onElement: this.element, matchingSelector: "a[contenteditable=false]", preventDefault: true }), o2("mousedown", { onElement: this.element, matchingSelector: t2, withCallback: this.didClickAttachment }), o2("click", { onElement: this.element, matchingSelector: "a" + t2, preventDefault: true });
              }
              return a2(c, u2), c.prototype.didFocus = function() {
                var t3, e3, n3;
                return t3 = function(t4) {
                  return function() {
                    var e4;
                    return t4.focused ? void 0 : (t4.focused = true, (e4 = t4.delegate) != null && typeof e4.compositionControllerDidFocus == "function" ? e4.compositionControllerDidFocus() : void 0);
                  };
                }(this), (e3 = (n3 = this.blurPromise) != null ? n3.then(t3) : void 0) != null ? e3 : t3();
              }, c.prototype.didBlur = function() {
                return this.blurPromise = new Promise(function(t3) {
                  return function(e3) {
                    return n2(function() {
                      var n3;
                      return r2(t3.element) || (t3.focused = null, (n3 = t3.delegate) != null && typeof n3.compositionControllerDidBlur == "function" && n3.compositionControllerDidBlur()), t3.blurPromise = null, e3();
                    });
                  };
                }(this));
              }, c.prototype.didClickAttachment = function(t3, e3) {
                var n3, o3, r3;
                return n3 = this.findAttachmentForElement(e3), o3 = i2(t3.target, { matchingSelector: "figcaption" }) != null, (r3 = this.delegate) != null && typeof r3.compositionControllerDidSelectAttachment == "function" ? r3.compositionControllerDidSelectAttachment(n3, { editCaption: o3 }) : void 0;
              }, c.prototype.getSerializableElement = function() {
                return this.isEditingAttachment() ? this.documentView.shadowElement : this.element;
              }, c.prototype.render = function() {
                var t3, e3, n3;
                return this.revision !== this.composition.revision && (this.documentView.setDocument(this.composition.document), this.documentView.render(), this.revision = this.composition.revision), this.canSyncDocumentView() && !this.documentView.isSynced() && ((t3 = this.delegate) != null && typeof t3.compositionControllerWillSyncDocumentView == "function" && t3.compositionControllerWillSyncDocumentView(), this.documentView.sync(), (e3 = this.delegate) != null && typeof e3.compositionControllerDidSyncDocumentView == "function" && e3.compositionControllerDidSyncDocumentView()), (n3 = this.delegate) != null && typeof n3.compositionControllerDidRender == "function" ? n3.compositionControllerDidRender() : void 0;
              }, c.prototype.rerenderViewForObject = function(t3) {
                return this.invalidateViewForObject(t3), this.render();
              }, c.prototype.invalidateViewForObject = function(t3) {
                return this.documentView.invalidateViewForObject(t3);
              }, c.prototype.isViewCachingEnabled = function() {
                return this.documentView.isViewCachingEnabled();
              }, c.prototype.enableViewCaching = function() {
                return this.documentView.enableViewCaching();
              }, c.prototype.disableViewCaching = function() {
                return this.documentView.disableViewCaching();
              }, c.prototype.refreshViewCache = function() {
                return this.documentView.garbageCollectCachedViews();
              }, c.prototype.isEditingAttachment = function() {
                return this.attachmentEditor != null;
              }, c.prototype.installAttachmentEditorForAttachment = function(t3, n3) {
                var i3, o3, r3;
                if (((r3 = this.attachmentEditor) != null ? r3.attachment : void 0) !== t3 && (o3 = this.documentView.findElementForObject(t3)))
                  return this.uninstallAttachmentEditor(), i3 = this.composition.document.getAttachmentPieceForAttachment(t3), this.attachmentEditor = new e2.AttachmentEditorController(i3, o3, this.element, n3), this.attachmentEditor.delegate = this;
              }, c.prototype.uninstallAttachmentEditor = function() {
                var t3;
                return (t3 = this.attachmentEditor) != null ? t3.uninstall() : void 0;
              }, c.prototype.didUninstallAttachmentEditor = function() {
                return this.attachmentEditor = null, this.render();
              }, c.prototype.attachmentEditorDidRequestUpdatingAttributesForAttachment = function(t3, e3) {
                var n3;
                return (n3 = this.delegate) != null && typeof n3.compositionControllerWillUpdateAttachment == "function" && n3.compositionControllerWillUpdateAttachment(e3), this.composition.updateAttributesForAttachment(t3, e3);
              }, c.prototype.attachmentEditorDidRequestRemovingAttributeForAttachment = function(t3, e3) {
                var n3;
                return (n3 = this.delegate) != null && typeof n3.compositionControllerWillUpdateAttachment == "function" && n3.compositionControllerWillUpdateAttachment(e3), this.composition.removeAttributeForAttachment(t3, e3);
              }, c.prototype.attachmentEditorDidRequestRemovalOfAttachment = function(t3) {
                var e3;
                return (e3 = this.delegate) != null && typeof e3.compositionControllerDidRequestRemovalOfAttachment == "function" ? e3.compositionControllerDidRequestRemovalOfAttachment(t3) : void 0;
              }, c.prototype.attachmentEditorDidRequestDeselectingAttachment = function(t3) {
                var e3;
                return (e3 = this.delegate) != null && typeof e3.compositionControllerDidRequestDeselectingAttachment == "function" ? e3.compositionControllerDidRequestDeselectingAttachment(t3) : void 0;
              }, c.prototype.canSyncDocumentView = function() {
                return !this.isEditingAttachment();
              }, c.prototype.findAttachmentForElement = function(t3) {
                return this.composition.document.getAttachmentById(parseInt(t3.dataset.trixId, 10));
              }, c;
            }(e2.BasicObject);
          }.call(this), function() {
            var t2, n2, i2, o2 = function(t3, e3) {
              return function() {
                return t3.apply(e3, arguments);
              };
            }, r2 = function(t3, e3) {
              function n3() {
                this.constructor = t3;
              }
              for (var i3 in e3)
                s2.call(e3, i3) && (t3[i3] = e3[i3]);
              return n3.prototype = e3.prototype, t3.prototype = new n3(), t3.__super__ = e3.prototype, t3;
            }, s2 = {}.hasOwnProperty;
            n2 = e2.handleEvent, i2 = e2.triggerEvent, t2 = e2.findClosestElementFromNode, e2.ToolbarController = function(e3) {
              function s3(t3) {
                this.element = t3, this.didKeyDownDialogInput = o2(this.didKeyDownDialogInput, this), this.didClickDialogButton = o2(this.didClickDialogButton, this), this.didClickAttributeButton = o2(this.didClickAttributeButton, this), this.didClickActionButton = o2(this.didClickActionButton, this), this.attributes = {}, this.actions = {}, this.resetDialogInputs(), n2("mousedown", { onElement: this.element, matchingSelector: a2, withCallback: this.didClickActionButton }), n2("mousedown", { onElement: this.element, matchingSelector: c, withCallback: this.didClickAttributeButton }), n2("click", { onElement: this.element, matchingSelector: v, preventDefault: true }), n2("click", { onElement: this.element, matchingSelector: l2, withCallback: this.didClickDialogButton }), n2("keydown", { onElement: this.element, matchingSelector: h2, withCallback: this.didKeyDownDialogInput });
              }
              var a2, u, c, l2, h2, p, d, f, g, m, v;
              return r2(s3, e3), c = "[data-trix-attribute]", a2 = "[data-trix-action]", v = c + ", " + a2, p = "[data-trix-dialog]", u = p + "[data-trix-active]", l2 = p + " [data-trix-method]", h2 = p + " [data-trix-input]", s3.prototype.didClickActionButton = function(t3, e4) {
                var n3, i3, o3;
                return (i3 = this.delegate) != null && i3.toolbarDidClickButton(), t3.preventDefault(), n3 = d(e4), this.getDialog(n3) ? this.toggleDialog(n3) : (o3 = this.delegate) != null ? o3.toolbarDidInvokeAction(n3) : void 0;
              }, s3.prototype.didClickAttributeButton = function(t3, e4) {
                var n3, i3, o3;
                return (i3 = this.delegate) != null && i3.toolbarDidClickButton(), t3.preventDefault(), n3 = f(e4), this.getDialog(n3) ? this.toggleDialog(n3) : (o3 = this.delegate) != null && o3.toolbarDidToggleAttribute(n3), this.refreshAttributeButtons();
              }, s3.prototype.didClickDialogButton = function(e4, n3) {
                var i3, o3;
                return i3 = t2(n3, { matchingSelector: p }), o3 = n3.getAttribute("data-trix-method"), this[o3].call(this, i3);
              }, s3.prototype.didKeyDownDialogInput = function(t3, e4) {
                var n3, i3;
                return t3.keyCode === 13 && (t3.preventDefault(), n3 = e4.getAttribute("name"), i3 = this.getDialog(n3), this.setAttribute(i3)), t3.keyCode === 27 ? (t3.preventDefault(), this.hideDialog()) : void 0;
              }, s3.prototype.updateActions = function(t3) {
                return this.actions = t3, this.refreshActionButtons();
              }, s3.prototype.refreshActionButtons = function() {
                return this.eachActionButton(function(t3) {
                  return function(e4, n3) {
                    return e4.disabled = t3.actions[n3] === false;
                  };
                }(this));
              }, s3.prototype.eachActionButton = function(t3) {
                var e4, n3, i3, o3, r3;
                for (o3 = this.element.querySelectorAll(a2), r3 = [], n3 = 0, i3 = o3.length; i3 > n3; n3++)
                  e4 = o3[n3], r3.push(t3(e4, d(e4)));
                return r3;
              }, s3.prototype.updateAttributes = function(t3) {
                return this.attributes = t3, this.refreshAttributeButtons();
              }, s3.prototype.refreshAttributeButtons = function() {
                return this.eachAttributeButton(function(t3) {
                  return function(e4, n3) {
                    return e4.disabled = t3.attributes[n3] === false, t3.attributes[n3] || t3.dialogIsVisible(n3) ? (e4.setAttribute("data-trix-active", ""), e4.classList.add("trix-active")) : (e4.removeAttribute("data-trix-active"), e4.classList.remove("trix-active"));
                  };
                }(this));
              }, s3.prototype.eachAttributeButton = function(t3) {
                var e4, n3, i3, o3, r3;
                for (o3 = this.element.querySelectorAll(c), r3 = [], n3 = 0, i3 = o3.length; i3 > n3; n3++)
                  e4 = o3[n3], r3.push(t3(e4, f(e4)));
                return r3;
              }, s3.prototype.applyKeyboardCommand = function(t3) {
                var e4, n3, o3, r3, s4, a3, u2;
                for (s4 = JSON.stringify(t3.sort()), u2 = this.element.querySelectorAll("[data-trix-key]"), r3 = 0, a3 = u2.length; a3 > r3; r3++)
                  if (e4 = u2[r3], o3 = e4.getAttribute("data-trix-key").split("+"), n3 = JSON.stringify(o3.sort()), n3 === s4)
                    return i2("mousedown", { onElement: e4 }), true;
                return false;
              }, s3.prototype.dialogIsVisible = function(t3) {
                var e4;
                return (e4 = this.getDialog(t3)) ? e4.hasAttribute("data-trix-active") : void 0;
              }, s3.prototype.toggleDialog = function(t3) {
                return this.dialogIsVisible(t3) ? this.hideDialog() : this.showDialog(t3);
              }, s3.prototype.showDialog = function(t3) {
                var e4, n3, i3, o3, r3, s4, a3, u2, c2, l3;
                for (this.hideDialog(), (a3 = this.delegate) != null && a3.toolbarWillShowDialog(), i3 = this.getDialog(t3), i3.setAttribute("data-trix-active", ""), i3.classList.add("trix-active"), u2 = i3.querySelectorAll("input[disabled]"), o3 = 0, s4 = u2.length; s4 > o3; o3++)
                  n3 = u2[o3], n3.removeAttribute("disabled");
                return (e4 = f(i3)) && (r3 = m(i3, t3)) && (r3.value = (c2 = this.attributes[e4]) != null ? c2 : "", r3.select()), (l3 = this.delegate) != null ? l3.toolbarDidShowDialog(t3) : void 0;
              }, s3.prototype.setAttribute = function(t3) {
                var e4, n3, i3;
                return e4 = f(t3), n3 = m(t3, e4), n3.willValidate && !n3.checkValidity() ? (n3.setAttribute("data-trix-validate", ""), n3.classList.add("trix-validate"), n3.focus()) : ((i3 = this.delegate) != null && i3.toolbarDidUpdateAttribute(e4, n3.value), this.hideDialog());
              }, s3.prototype.removeAttribute = function(t3) {
                var e4, n3;
                return e4 = f(t3), (n3 = this.delegate) != null && n3.toolbarDidRemoveAttribute(e4), this.hideDialog();
              }, s3.prototype.hideDialog = function() {
                var t3, e4;
                return (t3 = this.element.querySelector(u)) ? (t3.removeAttribute("data-trix-active"), t3.classList.remove("trix-active"), this.resetDialogInputs(), (e4 = this.delegate) != null ? e4.toolbarDidHideDialog(g(t3)) : void 0) : void 0;
              }, s3.prototype.resetDialogInputs = function() {
                var t3, e4, n3, i3, o3;
                for (i3 = this.element.querySelectorAll(h2), o3 = [], t3 = 0, n3 = i3.length; n3 > t3; t3++)
                  e4 = i3[t3], e4.setAttribute("disabled", "disabled"), e4.removeAttribute("data-trix-validate"), o3.push(e4.classList.remove("trix-validate"));
                return o3;
              }, s3.prototype.getDialog = function(t3) {
                return this.element.querySelector("[data-trix-dialog=" + t3 + "]");
              }, m = function(t3, e4) {
                return e4 == null && (e4 = f(t3)), t3.querySelector("[data-trix-input][name='" + e4 + "']");
              }, d = function(t3) {
                return t3.getAttribute("data-trix-action");
              }, f = function(t3) {
                var e4;
                return (e4 = t3.getAttribute("data-trix-attribute")) != null ? e4 : t3.getAttribute("data-trix-dialog-attribute");
              }, g = function(t3) {
                return t3.getAttribute("data-trix-dialog");
              }, s3;
            }(e2.BasicObject);
          }.call(this), function() {
            var t2 = function(t3, e3) {
              function i2() {
                this.constructor = t3;
              }
              for (var o2 in e3)
                n2.call(e3, o2) && (t3[o2] = e3[o2]);
              return i2.prototype = e3.prototype, t3.prototype = new i2(), t3.__super__ = e3.prototype, t3;
            }, n2 = {}.hasOwnProperty;
            e2.ImagePreloadOperation = function(e3) {
              function n3(t3) {
                this.url = t3;
              }
              return t2(n3, e3), n3.prototype.perform = function(t3) {
                var e4;
                return e4 = new Image(), e4.onload = function(n4) {
                  return function() {
                    return e4.width = n4.width = e4.naturalWidth, e4.height = n4.height = e4.naturalHeight, t3(true, e4);
                  };
                }(this), e4.onerror = function() {
                  return t3(false);
                }, e4.src = this.url;
              }, n3;
            }(e2.Operation);
          }.call(this), function() {
            var t2 = function(t3, e3) {
              return function() {
                return t3.apply(e3, arguments);
              };
            }, n2 = function(t3, e3) {
              function n3() {
                this.constructor = t3;
              }
              for (var o2 in e3)
                i2.call(e3, o2) && (t3[o2] = e3[o2]);
              return n3.prototype = e3.prototype, t3.prototype = new n3(), t3.__super__ = e3.prototype, t3;
            }, i2 = {}.hasOwnProperty;
            e2.Attachment = function(i3) {
              function o2(n3) {
                n3 == null && (n3 = {}), this.releaseFile = t2(this.releaseFile, this), o2.__super__.constructor.apply(this, arguments), this.attributes = e2.Hash.box(n3), this.didChangeAttributes();
              }
              return n2(o2, i3), o2.previewablePattern = /^image(\/(gif|png|jpe?g)|$)/, o2.attachmentForFile = function(t3) {
                var e3, n3;
                return n3 = this.attributesForFile(t3), e3 = new this(n3), e3.setFile(t3), e3;
              }, o2.attributesForFile = function(t3) {
                return new e2.Hash({ filename: t3.name, filesize: t3.size, contentType: t3.type });
              }, o2.fromJSON = function(t3) {
                return new this(t3);
              }, o2.prototype.getAttribute = function(t3) {
                return this.attributes.get(t3);
              }, o2.prototype.hasAttribute = function(t3) {
                return this.attributes.has(t3);
              }, o2.prototype.getAttributes = function() {
                return this.attributes.toObject();
              }, o2.prototype.setAttributes = function(t3) {
                var e3, n3, i4;
                return t3 == null && (t3 = {}), e3 = this.attributes.merge(t3), this.attributes.isEqualTo(e3) ? void 0 : (this.attributes = e3, this.didChangeAttributes(), (n3 = this.previewDelegate) != null && typeof n3.attachmentDidChangeAttributes == "function" && n3.attachmentDidChangeAttributes(this), (i4 = this.delegate) != null && typeof i4.attachmentDidChangeAttributes == "function" ? i4.attachmentDidChangeAttributes(this) : void 0);
              }, o2.prototype.didChangeAttributes = function() {
                return this.isPreviewable() ? this.preloadURL() : void 0;
              }, o2.prototype.isPending = function() {
                return this.file != null && !(this.getURL() || this.getHref());
              }, o2.prototype.isPreviewable = function() {
                return this.attributes.has("previewable") ? this.attributes.get("previewable") : this.constructor.previewablePattern.test(this.getContentType());
              }, o2.prototype.getType = function() {
                return this.hasContent() ? "content" : this.isPreviewable() ? "preview" : "file";
              }, o2.prototype.getURL = function() {
                return this.attributes.get("url");
              }, o2.prototype.getHref = function() {
                return this.attributes.get("href");
              }, o2.prototype.getFilename = function() {
                var t3;
                return (t3 = this.attributes.get("filename")) != null ? t3 : "";
              }, o2.prototype.getFilesize = function() {
                return this.attributes.get("filesize");
              }, o2.prototype.getFormattedFilesize = function() {
                var t3;
                return t3 = this.attributes.get("filesize"), typeof t3 == "number" ? e2.config.fileSize.formatter(t3) : "";
              }, o2.prototype.getExtension = function() {
                var t3;
                return (t3 = this.getFilename().match(/\.(\w+)$/)) != null ? t3[1].toLowerCase() : void 0;
              }, o2.prototype.getContentType = function() {
                return this.attributes.get("contentType");
              }, o2.prototype.hasContent = function() {
                return this.attributes.has("content");
              }, o2.prototype.getContent = function() {
                return this.attributes.get("content");
              }, o2.prototype.getWidth = function() {
                return this.attributes.get("width");
              }, o2.prototype.getHeight = function() {
                return this.attributes.get("height");
              }, o2.prototype.getFile = function() {
                return this.file;
              }, o2.prototype.setFile = function(t3) {
                return this.file = t3, this.isPreviewable() ? this.preloadFile() : void 0;
              }, o2.prototype.releaseFile = function() {
                return this.releasePreloadedFile(), this.file = null;
              }, o2.prototype.getUploadProgress = function() {
                var t3;
                return (t3 = this.uploadProgress) != null ? t3 : 0;
              }, o2.prototype.setUploadProgress = function(t3) {
                var e3;
                return this.uploadProgress !== t3 ? (this.uploadProgress = t3, (e3 = this.uploadProgressDelegate) != null && typeof e3.attachmentDidChangeUploadProgress == "function" ? e3.attachmentDidChangeUploadProgress(this) : void 0) : void 0;
              }, o2.prototype.toJSON = function() {
                return this.getAttributes();
              }, o2.prototype.getCacheKey = function() {
                return [o2.__super__.getCacheKey.apply(this, arguments), this.attributes.getCacheKey(), this.getPreviewURL()].join("/");
              }, o2.prototype.getPreviewURL = function() {
                return this.previewURL || this.preloadingURL;
              }, o2.prototype.setPreviewURL = function(t3) {
                var e3, n3;
                return t3 !== this.getPreviewURL() ? (this.previewURL = t3, (e3 = this.previewDelegate) != null && typeof e3.attachmentDidChangeAttributes == "function" && e3.attachmentDidChangeAttributes(this), (n3 = this.delegate) != null && typeof n3.attachmentDidChangePreviewURL == "function" ? n3.attachmentDidChangePreviewURL(this) : void 0) : void 0;
              }, o2.prototype.preloadURL = function() {
                return this.preload(this.getURL(), this.releaseFile);
              }, o2.prototype.preloadFile = function() {
                return this.file ? (this.fileObjectURL = URL.createObjectURL(this.file), this.preload(this.fileObjectURL)) : void 0;
              }, o2.prototype.releasePreloadedFile = function() {
                return this.fileObjectURL ? (URL.revokeObjectURL(this.fileObjectURL), this.fileObjectURL = null) : void 0;
              }, o2.prototype.preload = function(t3, n3) {
                var i4;
                return t3 && t3 !== this.getPreviewURL() ? (this.preloadingURL = t3, i4 = new e2.ImagePreloadOperation(t3), i4.then(function(e3) {
                  return function(i5) {
                    var o3, r2;
                    return r2 = i5.width, o3 = i5.height, e3.getWidth() && e3.getHeight() || e3.setAttributes({ width: r2, height: o3 }), e3.preloadingURL = null, e3.setPreviewURL(t3), typeof n3 == "function" ? n3() : void 0;
                  };
                }(this))["catch"](function(t4) {
                  return function() {
                    return t4.preloadingURL = null, typeof n3 == "function" ? n3() : void 0;
                  };
                }(this))) : void 0;
              }, o2;
            }(e2.Object);
          }.call(this), function() {
            var t2 = function(t3, e3) {
              function i2() {
                this.constructor = t3;
              }
              for (var o2 in e3)
                n2.call(e3, o2) && (t3[o2] = e3[o2]);
              return i2.prototype = e3.prototype, t3.prototype = new i2(), t3.__super__ = e3.prototype, t3;
            }, n2 = {}.hasOwnProperty;
            e2.Piece = function(n3) {
              function i2(t3, n4) {
                n4 == null && (n4 = {}), i2.__super__.constructor.apply(this, arguments), this.attributes = e2.Hash.box(n4);
              }
              return t2(i2, n3), i2.types = {}, i2.registerType = function(t3, e3) {
                return e3.type = t3, this.types[t3] = e3;
              }, i2.fromJSON = function(t3) {
                var e3;
                return (e3 = this.types[t3.type]) ? e3.fromJSON(t3) : void 0;
              }, i2.prototype.copyWithAttributes = function(t3) {
                return new this.constructor(this.getValue(), t3);
              }, i2.prototype.copyWithAdditionalAttributes = function(t3) {
                return this.copyWithAttributes(this.attributes.merge(t3));
              }, i2.prototype.copyWithoutAttribute = function(t3) {
                return this.copyWithAttributes(this.attributes.remove(t3));
              }, i2.prototype.copy = function() {
                return this.copyWithAttributes(this.attributes);
              }, i2.prototype.getAttribute = function(t3) {
                return this.attributes.get(t3);
              }, i2.prototype.getAttributesHash = function() {
                return this.attributes;
              }, i2.prototype.getAttributes = function() {
                return this.attributes.toObject();
              }, i2.prototype.getCommonAttributes = function() {
                var t3, e3, n4;
                return (n4 = pieceList.getPieceAtIndex(0)) ? (t3 = n4.attributes, e3 = t3.getKeys(), pieceList.eachPiece(function(n5) {
                  return e3 = t3.getKeysCommonToHash(n5.attributes), t3 = t3.slice(e3);
                }), t3.toObject()) : {};
              }, i2.prototype.hasAttribute = function(t3) {
                return this.attributes.has(t3);
              }, i2.prototype.hasSameStringValueAsPiece = function(t3) {
                return t3 != null && this.toString() === t3.toString();
              }, i2.prototype.hasSameAttributesAsPiece = function(t3) {
                return t3 != null && (this.attributes === t3.attributes || this.attributes.isEqualTo(t3.attributes));
              }, i2.prototype.isBlockBreak = function() {
                return false;
              }, i2.prototype.isEqualTo = function(t3) {
                return i2.__super__.isEqualTo.apply(this, arguments) || this.hasSameConstructorAs(t3) && this.hasSameStringValueAsPiece(t3) && this.hasSameAttributesAsPiece(t3);
              }, i2.prototype.isEmpty = function() {
                return this.length === 0;
              }, i2.prototype.isSerializable = function() {
                return true;
              }, i2.prototype.toJSON = function() {
                return { type: this.constructor.type, attributes: this.getAttributes() };
              }, i2.prototype.contentsForInspection = function() {
                return { type: this.constructor.type, attributes: this.attributes.inspect() };
              }, i2.prototype.canBeGrouped = function() {
                return this.hasAttribute("href");
              }, i2.prototype.canBeGroupedWith = function(t3) {
                return this.getAttribute("href") === t3.getAttribute("href");
              }, i2.prototype.getLength = function() {
                return this.length;
              }, i2.prototype.canBeConsolidatedWith = function() {
                return false;
              }, i2;
            }(e2.Object);
          }.call(this), function() {
            var t2 = function(t3, e3) {
              function i2() {
                this.constructor = t3;
              }
              for (var o2 in e3)
                n2.call(e3, o2) && (t3[o2] = e3[o2]);
              return i2.prototype = e3.prototype, t3.prototype = new i2(), t3.__super__ = e3.prototype, t3;
            }, n2 = {}.hasOwnProperty;
            e2.Piece.registerType("attachment", e2.AttachmentPiece = function(n3) {
              function i2(t3) {
                this.attachment = t3, i2.__super__.constructor.apply(this, arguments), this.length = 1, this.ensureAttachmentExclusivelyHasAttribute("href"), this.attachment.hasContent() || this.removeProhibitedAttributes();
              }
              return t2(i2, n3), i2.fromJSON = function(t3) {
                return new this(e2.Attachment.fromJSON(t3.attachment), t3.attributes);
              }, i2.permittedAttributes = ["caption", "presentation"], i2.prototype.ensureAttachmentExclusivelyHasAttribute = function(t3) {
                return this.hasAttribute(t3) ? (this.attachment.hasAttribute(t3) || this.attachment.setAttributes(this.attributes.slice(t3)), this.attributes = this.attributes.remove(t3)) : void 0;
              }, i2.prototype.removeProhibitedAttributes = function() {
                var t3;
                return t3 = this.attributes.slice(this.constructor.permittedAttributes), t3.isEqualTo(this.attributes) ? void 0 : this.attributes = t3;
              }, i2.prototype.getValue = function() {
                return this.attachment;
              }, i2.prototype.isSerializable = function() {
                return !this.attachment.isPending();
              }, i2.prototype.getCaption = function() {
                var t3;
                return (t3 = this.attributes.get("caption")) != null ? t3 : "";
              }, i2.prototype.isEqualTo = function(t3) {
                var e3;
                return i2.__super__.isEqualTo.apply(this, arguments) && this.attachment.id === (t3 != null && (e3 = t3.attachment) != null ? e3.id : void 0);
              }, i2.prototype.toString = function() {
                return e2.OBJECT_REPLACEMENT_CHARACTER;
              }, i2.prototype.toJSON = function() {
                var t3;
                return t3 = i2.__super__.toJSON.apply(this, arguments), t3.attachment = this.attachment, t3;
              }, i2.prototype.getCacheKey = function() {
                return [i2.__super__.getCacheKey.apply(this, arguments), this.attachment.getCacheKey()].join("/");
              }, i2.prototype.toConsole = function() {
                return JSON.stringify(this.toString());
              }, i2;
            }(e2.Piece));
          }.call(this), function() {
            var t2, n2 = function(t3, e3) {
              function n3() {
                this.constructor = t3;
              }
              for (var o2 in e3)
                i2.call(e3, o2) && (t3[o2] = e3[o2]);
              return n3.prototype = e3.prototype, t3.prototype = new n3(), t3.__super__ = e3.prototype, t3;
            }, i2 = {}.hasOwnProperty;
            t2 = e2.normalizeNewlines, e2.Piece.registerType("string", e2.StringPiece = function(e3) {
              function i3(e4) {
                i3.__super__.constructor.apply(this, arguments), this.string = t2(e4), this.length = this.string.length;
              }
              return n2(i3, e3), i3.fromJSON = function(t3) {
                return new this(t3.string, t3.attributes);
              }, i3.prototype.getValue = function() {
                return this.string;
              }, i3.prototype.toString = function() {
                return this.string.toString();
              }, i3.prototype.isBlockBreak = function() {
                return this.toString() === "\n" && this.getAttribute("blockBreak") === true;
              }, i3.prototype.toJSON = function() {
                var t3;
                return t3 = i3.__super__.toJSON.apply(this, arguments), t3.string = this.string, t3;
              }, i3.prototype.canBeConsolidatedWith = function(t3) {
                return t3 != null && this.hasSameConstructorAs(t3) && this.hasSameAttributesAsPiece(t3);
              }, i3.prototype.consolidateWith = function(t3) {
                return new this.constructor(this.toString() + t3.toString(), this.attributes);
              }, i3.prototype.splitAtOffset = function(t3) {
                var e4, n3;
                return t3 === 0 ? (e4 = null, n3 = this) : t3 === this.length ? (e4 = this, n3 = null) : (e4 = new this.constructor(this.string.slice(0, t3), this.attributes), n3 = new this.constructor(this.string.slice(t3), this.attributes)), [e4, n3];
              }, i3.prototype.toConsole = function() {
                var t3;
                return t3 = this.string, t3.length > 15 && (t3 = t3.slice(0, 14) + "\u2026"), JSON.stringify(t3.toString());
              }, i3;
            }(e2.Piece));
          }.call(this), function() {
            var t2, n2 = function(t3, e3) {
              function n3() {
                this.constructor = t3;
              }
              for (var o3 in e3)
                i2.call(e3, o3) && (t3[o3] = e3[o3]);
              return n3.prototype = e3.prototype, t3.prototype = new n3(), t3.__super__ = e3.prototype, t3;
            }, i2 = {}.hasOwnProperty, o2 = [].slice;
            t2 = e2.spliceArray, e2.SplittableList = function(e3) {
              function i3(t3) {
                t3 == null && (t3 = []), i3.__super__.constructor.apply(this, arguments), this.objects = t3.slice(0), this.length = this.objects.length;
              }
              var r2, s2, a2;
              return n2(i3, e3), i3.box = function(t3) {
                return t3 instanceof this ? t3 : new this(t3);
              }, i3.prototype.indexOf = function(t3) {
                return this.objects.indexOf(t3);
              }, i3.prototype.splice = function() {
                var e4;
                return e4 = 1 <= arguments.length ? o2.call(arguments, 0) : [], new this.constructor(t2.apply(null, [this.objects].concat(o2.call(e4))));
              }, i3.prototype.eachObject = function(t3) {
                var e4, n3, i4, o3, r3, s3;
                for (r3 = this.objects, s3 = [], n3 = e4 = 0, i4 = r3.length; i4 > e4; n3 = ++e4)
                  o3 = r3[n3], s3.push(t3(o3, n3));
                return s3;
              }, i3.prototype.insertObjectAtIndex = function(t3, e4) {
                return this.splice(e4, 0, t3);
              }, i3.prototype.insertSplittableListAtIndex = function(t3, e4) {
                return this.splice.apply(this, [e4, 0].concat(o2.call(t3.objects)));
              }, i3.prototype.insertSplittableListAtPosition = function(t3, e4) {
                var n3, i4, o3;
                return o3 = this.splitObjectAtPosition(e4), i4 = o3[0], n3 = o3[1], new this.constructor(i4).insertSplittableListAtIndex(t3, n3);
              }, i3.prototype.editObjectAtIndex = function(t3, e4) {
                return this.replaceObjectAtIndex(e4(this.objects[t3]), t3);
              }, i3.prototype.replaceObjectAtIndex = function(t3, e4) {
                return this.splice(e4, 1, t3);
              }, i3.prototype.removeObjectAtIndex = function(t3) {
                return this.splice(t3, 1);
              }, i3.prototype.getObjectAtIndex = function(t3) {
                return this.objects[t3];
              }, i3.prototype.getSplittableListInRange = function(t3) {
                var e4, n3, i4, o3;
                return i4 = this.splitObjectsAtRange(t3), n3 = i4[0], e4 = i4[1], o3 = i4[2], new this.constructor(n3.slice(e4, o3 + 1));
              }, i3.prototype.selectSplittableList = function(t3) {
                var e4, n3;
                return n3 = function() {
                  var n4, i4, o3, r3;
                  for (o3 = this.objects, r3 = [], n4 = 0, i4 = o3.length; i4 > n4; n4++)
                    e4 = o3[n4], t3(e4) && r3.push(e4);
                  return r3;
                }.call(this), new this.constructor(n3);
              }, i3.prototype.removeObjectsInRange = function(t3) {
                var e4, n3, i4, o3;
                return i4 = this.splitObjectsAtRange(t3), n3 = i4[0], e4 = i4[1], o3 = i4[2], new this.constructor(n3).splice(e4, o3 - e4 + 1);
              }, i3.prototype.transformObjectsInRange = function(t3, e4) {
                var n3, i4, o3, r3, s3, a3, u;
                return s3 = this.splitObjectsAtRange(t3), r3 = s3[0], i4 = s3[1], a3 = s3[2], u = function() {
                  var t4, s4, u2;
                  for (u2 = [], n3 = t4 = 0, s4 = r3.length; s4 > t4; n3 = ++t4)
                    o3 = r3[n3], u2.push(n3 >= i4 && a3 >= n3 ? e4(o3) : o3);
                  return u2;
                }(), new this.constructor(u);
              }, i3.prototype.splitObjectsAtRange = function(t3) {
                var e4, n3, i4, o3, s3, u;
                return o3 = this.splitObjectAtPosition(a2(t3)), n3 = o3[0], e4 = o3[1], i4 = o3[2], s3 = new this.constructor(n3).splitObjectAtPosition(r2(t3) + i4), n3 = s3[0], u = s3[1], [n3, e4, u - 1];
              }, i3.prototype.getObjectAtPosition = function(t3) {
                var e4, n3, i4;
                return i4 = this.findIndexAndOffsetAtPosition(t3), e4 = i4.index, n3 = i4.offset, this.objects[e4];
              }, i3.prototype.splitObjectAtPosition = function(t3) {
                var e4, n3, i4, o3, r3, s3, a3, u, c, l2;
                return s3 = this.findIndexAndOffsetAtPosition(t3), e4 = s3.index, r3 = s3.offset, o3 = this.objects.slice(0), e4 != null ? r3 === 0 ? (c = e4, l2 = 0) : (i4 = this.getObjectAtIndex(e4), a3 = i4.splitAtOffset(r3), n3 = a3[0], u = a3[1], o3.splice(e4, 1, n3, u), c = e4 + 1, l2 = n3.getLength() - r3) : (c = o3.length, l2 = 0), [o3, c, l2];
              }, i3.prototype.consolidate = function() {
                var t3, e4, n3, i4, o3, r3;
                for (i4 = [], o3 = this.objects[0], r3 = this.objects.slice(1), t3 = 0, e4 = r3.length; e4 > t3; t3++)
                  n3 = r3[t3], (typeof o3.canBeConsolidatedWith == "function" ? o3.canBeConsolidatedWith(n3) : void 0) ? o3 = o3.consolidateWith(n3) : (i4.push(o3), o3 = n3);
                return o3 != null && i4.push(o3), new this.constructor(i4);
              }, i3.prototype.consolidateFromIndexToIndex = function(t3, e4) {
                var n3, i4, r3;
                return i4 = this.objects.slice(0), r3 = i4.slice(t3, e4 + 1), n3 = new this.constructor(r3).consolidate().toArray(), this.splice.apply(this, [t3, r3.length].concat(o2.call(n3)));
              }, i3.prototype.findIndexAndOffsetAtPosition = function(t3) {
                var e4, n3, i4, o3, r3, s3, a3;
                for (e4 = 0, a3 = this.objects, i4 = n3 = 0, o3 = a3.length; o3 > n3; i4 = ++n3) {
                  if (s3 = a3[i4], r3 = e4 + s3.getLength(), t3 >= e4 && r3 > t3)
                    return { index: i4, offset: t3 - e4 };
                  e4 = r3;
                }
                return { index: null, offset: null };
              }, i3.prototype.findPositionAtIndexAndOffset = function(t3, e4) {
                var n3, i4, o3, r3, s3, a3;
                for (s3 = 0, a3 = this.objects, n3 = i4 = 0, o3 = a3.length; o3 > i4; n3 = ++i4)
                  if (r3 = a3[n3], t3 > n3)
                    s3 += r3.getLength();
                  else if (n3 === t3) {
                    s3 += e4;
                    break;
                  }
                return s3;
              }, i3.prototype.getEndPosition = function() {
                var t3, e4;
                return this.endPosition != null ? this.endPosition : this.endPosition = function() {
                  var n3, i4, o3;
                  for (e4 = 0, o3 = this.objects, n3 = 0, i4 = o3.length; i4 > n3; n3++)
                    t3 = o3[n3], e4 += t3.getLength();
                  return e4;
                }.call(this);
              }, i3.prototype.toString = function() {
                return this.objects.join("");
              }, i3.prototype.toArray = function() {
                return this.objects.slice(0);
              }, i3.prototype.toJSON = function() {
                return this.toArray();
              }, i3.prototype.isEqualTo = function(t3) {
                return i3.__super__.isEqualTo.apply(this, arguments) || s2(this.objects, t3 != null ? t3.objects : void 0);
              }, s2 = function(t3, e4) {
                var n3, i4, o3, r3, s3;
                if (e4 == null && (e4 = []), t3.length !== e4.length)
                  return false;
                for (s3 = true, i4 = n3 = 0, o3 = t3.length; o3 > n3; i4 = ++n3)
                  r3 = t3[i4], s3 && !r3.isEqualTo(e4[i4]) && (s3 = false);
                return s3;
              }, i3.prototype.contentsForInspection = function() {
                var t3;
                return { objects: "[" + function() {
                  var e4, n3, i4, o3;
                  for (i4 = this.objects, o3 = [], e4 = 0, n3 = i4.length; n3 > e4; e4++)
                    t3 = i4[e4], o3.push(t3.inspect());
                  return o3;
                }.call(this).join(", ") + "]" };
              }, a2 = function(t3) {
                return t3[0];
              }, r2 = function(t3) {
                return t3[1];
              }, i3;
            }(e2.Object);
          }.call(this), function() {
            var t2 = function(t3, e3) {
              function i2() {
                this.constructor = t3;
              }
              for (var o2 in e3)
                n2.call(e3, o2) && (t3[o2] = e3[o2]);
              return i2.prototype = e3.prototype, t3.prototype = new i2(), t3.__super__ = e3.prototype, t3;
            }, n2 = {}.hasOwnProperty;
            e2.Text = function(n3) {
              function i2(t3) {
                var n4;
                t3 == null && (t3 = []), i2.__super__.constructor.apply(this, arguments), this.pieceList = new e2.SplittableList(function() {
                  var e3, i3, o2;
                  for (o2 = [], e3 = 0, i3 = t3.length; i3 > e3; e3++)
                    n4 = t3[e3], n4.isEmpty() || o2.push(n4);
                  return o2;
                }());
              }
              return t2(i2, n3), i2.textForAttachmentWithAttributes = function(t3, n4) {
                var i3;
                return i3 = new e2.AttachmentPiece(t3, n4), new this([i3]);
              }, i2.textForStringWithAttributes = function(t3, n4) {
                var i3;
                return i3 = new e2.StringPiece(t3, n4), new this([i3]);
              }, i2.fromJSON = function(t3) {
                var n4, i3;
                return i3 = function() {
                  var i4, o2, r2;
                  for (r2 = [], i4 = 0, o2 = t3.length; o2 > i4; i4++)
                    n4 = t3[i4], r2.push(e2.Piece.fromJSON(n4));
                  return r2;
                }(), new this(i3);
              }, i2.prototype.copy = function() {
                return this.copyWithPieceList(this.pieceList);
              }, i2.prototype.copyWithPieceList = function(t3) {
                return new this.constructor(t3.consolidate().toArray());
              }, i2.prototype.copyUsingObjectMap = function(t3) {
                var e3, n4;
                return n4 = function() {
                  var n5, i3, o2, r2, s2;
                  for (o2 = this.getPieces(), s2 = [], n5 = 0, i3 = o2.length; i3 > n5; n5++)
                    e3 = o2[n5], s2.push((r2 = t3.find(e3)) != null ? r2 : e3);
                  return s2;
                }.call(this), new this.constructor(n4);
              }, i2.prototype.appendText = function(t3) {
                return this.insertTextAtPosition(t3, this.getLength());
              }, i2.prototype.insertTextAtPosition = function(t3, e3) {
                return this.copyWithPieceList(this.pieceList.insertSplittableListAtPosition(t3.pieceList, e3));
              }, i2.prototype.removeTextAtRange = function(t3) {
                return this.copyWithPieceList(this.pieceList.removeObjectsInRange(t3));
              }, i2.prototype.replaceTextAtRange = function(t3, e3) {
                return this.removeTextAtRange(e3).insertTextAtPosition(t3, e3[0]);
              }, i2.prototype.moveTextFromRangeToPosition = function(t3, e3) {
                var n4, i3;
                if (!(t3[0] <= e3 && e3 <= t3[1]))
                  return i3 = this.getTextAtRange(t3), n4 = i3.getLength(), t3[0] < e3 && (e3 -= n4), this.removeTextAtRange(t3).insertTextAtPosition(i3, e3);
              }, i2.prototype.addAttributeAtRange = function(t3, e3, n4) {
                var i3;
                return i3 = {}, i3[t3] = e3, this.addAttributesAtRange(i3, n4);
              }, i2.prototype.addAttributesAtRange = function(t3, e3) {
                return this.copyWithPieceList(this.pieceList.transformObjectsInRange(e3, function(e4) {
                  return e4.copyWithAdditionalAttributes(t3);
                }));
              }, i2.prototype.removeAttributeAtRange = function(t3, e3) {
                return this.copyWithPieceList(this.pieceList.transformObjectsInRange(e3, function(e4) {
                  return e4.copyWithoutAttribute(t3);
                }));
              }, i2.prototype.setAttributesAtRange = function(t3, e3) {
                return this.copyWithPieceList(this.pieceList.transformObjectsInRange(e3, function(e4) {
                  return e4.copyWithAttributes(t3);
                }));
              }, i2.prototype.getAttributesAtPosition = function(t3) {
                var e3, n4;
                return (e3 = (n4 = this.pieceList.getObjectAtPosition(t3)) != null ? n4.getAttributes() : void 0) != null ? e3 : {};
              }, i2.prototype.getCommonAttributes = function() {
                var t3, n4;
                return t3 = function() {
                  var t4, e3, i3, o2;
                  for (i3 = this.pieceList.toArray(), o2 = [], t4 = 0, e3 = i3.length; e3 > t4; t4++)
                    n4 = i3[t4], o2.push(n4.getAttributes());
                  return o2;
                }.call(this), e2.Hash.fromCommonAttributesOfObjects(t3).toObject();
              }, i2.prototype.getCommonAttributesAtRange = function(t3) {
                var e3;
                return (e3 = this.getTextAtRange(t3).getCommonAttributes()) != null ? e3 : {};
              }, i2.prototype.getExpandedRangeForAttributeAtOffset = function(t3, e3) {
                var n4, i3, o2;
                for (n4 = o2 = e3, i3 = this.getLength(); n4 > 0 && this.getCommonAttributesAtRange([n4 - 1, o2])[t3]; )
                  n4--;
                for (; i3 > o2 && this.getCommonAttributesAtRange([e3, o2 + 1])[t3]; )
                  o2++;
                return [n4, o2];
              }, i2.prototype.getTextAtRange = function(t3) {
                return this.copyWithPieceList(this.pieceList.getSplittableListInRange(t3));
              }, i2.prototype.getStringAtRange = function(t3) {
                return this.pieceList.getSplittableListInRange(t3).toString();
              }, i2.prototype.getStringAtPosition = function(t3) {
                return this.getStringAtRange([t3, t3 + 1]);
              }, i2.prototype.startsWithString = function(t3) {
                return this.getStringAtRange([0, t3.length]) === t3;
              }, i2.prototype.endsWithString = function(t3) {
                var e3;
                return e3 = this.getLength(), this.getStringAtRange([e3 - t3.length, e3]) === t3;
              }, i2.prototype.getAttachmentPieces = function() {
                var t3, e3, n4, i3, o2;
                for (i3 = this.pieceList.toArray(), o2 = [], t3 = 0, e3 = i3.length; e3 > t3; t3++)
                  n4 = i3[t3], n4.attachment != null && o2.push(n4);
                return o2;
              }, i2.prototype.getAttachments = function() {
                var t3, e3, n4, i3, o2;
                for (i3 = this.getAttachmentPieces(), o2 = [], t3 = 0, e3 = i3.length; e3 > t3; t3++)
                  n4 = i3[t3], o2.push(n4.attachment);
                return o2;
              }, i2.prototype.getAttachmentAndPositionById = function(t3) {
                var e3, n4, i3, o2, r2, s2;
                for (o2 = 0, r2 = this.pieceList.toArray(), e3 = 0, n4 = r2.length; n4 > e3; e3++) {
                  if (i3 = r2[e3], ((s2 = i3.attachment) != null ? s2.id : void 0) === t3)
                    return { attachment: i3.attachment, position: o2 };
                  o2 += i3.length;
                }
                return { attachment: null, position: null };
              }, i2.prototype.getAttachmentById = function(t3) {
                var e3, n4, i3;
                return i3 = this.getAttachmentAndPositionById(t3), e3 = i3.attachment, n4 = i3.position, e3;
              }, i2.prototype.getRangeOfAttachment = function(t3) {
                var e3, n4;
                return n4 = this.getAttachmentAndPositionById(t3.id), t3 = n4.attachment, e3 = n4.position, t3 != null ? [e3, e3 + 1] : void 0;
              }, i2.prototype.updateAttributesForAttachment = function(t3, e3) {
                var n4;
                return (n4 = this.getRangeOfAttachment(e3)) ? this.addAttributesAtRange(t3, n4) : this;
              }, i2.prototype.getLength = function() {
                return this.pieceList.getEndPosition();
              }, i2.prototype.isEmpty = function() {
                return this.getLength() === 0;
              }, i2.prototype.isEqualTo = function(t3) {
                var e3;
                return i2.__super__.isEqualTo.apply(this, arguments) || (t3 != null && (e3 = t3.pieceList) != null ? e3.isEqualTo(this.pieceList) : void 0);
              }, i2.prototype.isBlockBreak = function() {
                return this.getLength() === 1 && this.pieceList.getObjectAtIndex(0).isBlockBreak();
              }, i2.prototype.eachPiece = function(t3) {
                return this.pieceList.eachObject(t3);
              }, i2.prototype.getPieces = function() {
                return this.pieceList.toArray();
              }, i2.prototype.getPieceAtPosition = function(t3) {
                return this.pieceList.getObjectAtPosition(t3);
              }, i2.prototype.contentsForInspection = function() {
                return { pieceList: this.pieceList.inspect() };
              }, i2.prototype.toSerializableText = function() {
                var t3;
                return t3 = this.pieceList.selectSplittableList(function(t4) {
                  return t4.isSerializable();
                }), this.copyWithPieceList(t3);
              }, i2.prototype.toString = function() {
                return this.pieceList.toString();
              }, i2.prototype.toJSON = function() {
                return this.pieceList.toJSON();
              }, i2.prototype.toConsole = function() {
                var t3;
                return JSON.stringify(function() {
                  var e3, n4, i3, o2;
                  for (i3 = this.pieceList.toArray(), o2 = [], e3 = 0, n4 = i3.length; n4 > e3; e3++)
                    t3 = i3[e3], o2.push(JSON.parse(t3.toConsole()));
                  return o2;
                }.call(this));
              }, i2.prototype.getDirection = function() {
                return e2.getDirection(this.toString());
              }, i2.prototype.isRTL = function() {
                return this.getDirection() === "rtl";
              }, i2;
            }(e2.Object);
          }.call(this), function() {
            var t2, n2, i2, o2, r2, s2 = function(t3, e3) {
              function n3() {
                this.constructor = t3;
              }
              for (var i3 in e3)
                a2.call(e3, i3) && (t3[i3] = e3[i3]);
              return n3.prototype = e3.prototype, t3.prototype = new n3(), t3.__super__ = e3.prototype, t3;
            }, a2 = {}.hasOwnProperty, u = [].indexOf || function(t3) {
              for (var e3 = 0, n3 = this.length; n3 > e3; e3++)
                if (e3 in this && this[e3] === t3)
                  return e3;
              return -1;
            }, c = [].slice;
            t2 = e2.arraysAreEqual, r2 = e2.spliceArray, i2 = e2.getBlockConfig, n2 = e2.getBlockAttributeNames, o2 = e2.getListAttributeNames, e2.Block = function(n3) {
              function a3(t3, n4) {
                t3 == null && (t3 = new e2.Text()), n4 == null && (n4 = []), a3.__super__.constructor.apply(this, arguments), this.text = h2(t3), this.attributes = n4;
              }
              var l2, h2, p, d, f, g, m, v, y;
              return s2(a3, n3), a3.fromJSON = function(t3) {
                var n4;
                return n4 = e2.Text.fromJSON(t3.text), new this(n4, t3.attributes);
              }, a3.prototype.isEmpty = function() {
                return this.text.isBlockBreak();
              }, a3.prototype.isEqualTo = function(e3) {
                return a3.__super__.isEqualTo.apply(this, arguments) || this.text.isEqualTo(e3 != null ? e3.text : void 0) && t2(this.attributes, e3 != null ? e3.attributes : void 0);
              }, a3.prototype.copyWithText = function(t3) {
                return new this.constructor(t3, this.attributes);
              }, a3.prototype.copyWithoutText = function() {
                return this.copyWithText(null);
              }, a3.prototype.copyWithAttributes = function(t3) {
                return new this.constructor(this.text, t3);
              }, a3.prototype.copyWithoutAttributes = function() {
                return this.copyWithAttributes(null);
              }, a3.prototype.copyUsingObjectMap = function(t3) {
                var e3;
                return this.copyWithText((e3 = t3.find(this.text)) ? e3 : this.text.copyUsingObjectMap(t3));
              }, a3.prototype.addAttribute = function(t3) {
                var e3;
                return e3 = this.attributes.concat(d(t3)), this.copyWithAttributes(e3);
              }, a3.prototype.removeAttribute = function(t3) {
                var e3, n4;
                return n4 = i2(t3).listAttribute, e3 = g(g(this.attributes, t3), n4), this.copyWithAttributes(e3);
              }, a3.prototype.removeLastAttribute = function() {
                return this.removeAttribute(this.getLastAttribute());
              }, a3.prototype.getLastAttribute = function() {
                return f(this.attributes);
              }, a3.prototype.getAttributes = function() {
                return this.attributes.slice(0);
              }, a3.prototype.getAttributeLevel = function() {
                return this.attributes.length;
              }, a3.prototype.getAttributeAtLevel = function(t3) {
                return this.attributes[t3 - 1];
              }, a3.prototype.hasAttribute = function(t3) {
                return u.call(this.attributes, t3) >= 0;
              }, a3.prototype.hasAttributes = function() {
                return this.getAttributeLevel() > 0;
              }, a3.prototype.getLastNestableAttribute = function() {
                return f(this.getNestableAttributes());
              }, a3.prototype.getNestableAttributes = function() {
                var t3, e3, n4, o3, r3;
                for (o3 = this.attributes, r3 = [], e3 = 0, n4 = o3.length; n4 > e3; e3++)
                  t3 = o3[e3], i2(t3).nestable && r3.push(t3);
                return r3;
              }, a3.prototype.getNestingLevel = function() {
                return this.getNestableAttributes().length;
              }, a3.prototype.decreaseNestingLevel = function() {
                var t3;
                return (t3 = this.getLastNestableAttribute()) ? this.removeAttribute(t3) : this;
              }, a3.prototype.increaseNestingLevel = function() {
                var t3, e3, n4;
                return (t3 = this.getLastNestableAttribute()) ? (n4 = this.attributes.lastIndexOf(t3), e3 = r2.apply(null, [this.attributes, n4 + 1, 0].concat(c.call(d(t3)))), this.copyWithAttributes(e3)) : this;
              }, a3.prototype.getListItemAttributes = function() {
                var t3, e3, n4, o3, r3;
                for (o3 = this.attributes, r3 = [], e3 = 0, n4 = o3.length; n4 > e3; e3++)
                  t3 = o3[e3], i2(t3).listAttribute && r3.push(t3);
                return r3;
              }, a3.prototype.isListItem = function() {
                var t3;
                return (t3 = i2(this.getLastAttribute())) != null ? t3.listAttribute : void 0;
              }, a3.prototype.isTerminalBlock = function() {
                var t3;
                return (t3 = i2(this.getLastAttribute())) != null ? t3.terminal : void 0;
              }, a3.prototype.breaksOnReturn = function() {
                var t3;
                return (t3 = i2(this.getLastAttribute())) != null ? t3.breakOnReturn : void 0;
              }, a3.prototype.findLineBreakInDirectionFromPosition = function(t3, e3) {
                var n4, i3;
                return i3 = this.toString(), n4 = function() {
                  switch (t3) {
                    case "forward":
                      return i3.indexOf("\n", e3);
                    case "backward":
                      return i3.slice(0, e3).lastIndexOf("\n");
                  }
                }(), n4 !== -1 ? n4 : void 0;
              }, a3.prototype.contentsForInspection = function() {
                return { text: this.text.inspect(), attributes: this.attributes };
              }, a3.prototype.toString = function() {
                return this.text.toString();
              }, a3.prototype.toJSON = function() {
                return { text: this.text, attributes: this.attributes };
              }, a3.prototype.getDirection = function() {
                return this.text.getDirection();
              }, a3.prototype.isRTL = function() {
                return this.text.isRTL();
              }, a3.prototype.getLength = function() {
                return this.text.getLength();
              }, a3.prototype.canBeConsolidatedWith = function(t3) {
                return !this.hasAttributes() && !t3.hasAttributes() && this.getDirection() === t3.getDirection();
              }, a3.prototype.consolidateWith = function(t3) {
                var n4, i3;
                return n4 = e2.Text.textForStringWithAttributes("\n"), i3 = this.getTextWithoutBlockBreak().appendText(n4), this.copyWithText(i3.appendText(t3.text));
              }, a3.prototype.splitAtOffset = function(t3) {
                var e3, n4;
                return t3 === 0 ? (e3 = null, n4 = this) : t3 === this.getLength() ? (e3 = this, n4 = null) : (e3 = this.copyWithText(this.text.getTextAtRange([0, t3])), n4 = this.copyWithText(this.text.getTextAtRange([t3, this.getLength()]))), [e3, n4];
              }, a3.prototype.getBlockBreakPosition = function() {
                return this.text.getLength() - 1;
              }, a3.prototype.getTextWithoutBlockBreak = function() {
                return m(this.text) ? this.text.getTextAtRange([0, this.getBlockBreakPosition()]) : this.text.copy();
              }, a3.prototype.canBeGrouped = function(t3) {
                return this.attributes[t3];
              }, a3.prototype.canBeGroupedWith = function(t3, e3) {
                var n4, r3, s3, a4;
                return s3 = t3.getAttributes(), r3 = s3[e3], n4 = this.attributes[e3], !(n4 !== r3 || i2(n4).group === false && (a4 = s3[e3 + 1], u.call(o2(), a4) < 0) || this.getDirection() !== t3.getDirection() && !t3.isEmpty());
              }, h2 = function(t3) {
                return t3 = y(t3), t3 = l2(t3);
              }, y = function(t3) {
                var n4, i3, o3, r3, s3, a4;
                return r3 = false, a4 = t3.getPieces(), i3 = 2 <= a4.length ? c.call(a4, 0, n4 = a4.length - 1) : (n4 = 0, []), o3 = a4[n4++], o3 == null ? t3 : (i3 = function() {
                  var t4, e3, n5;
                  for (n5 = [], t4 = 0, e3 = i3.length; e3 > t4; t4++)
                    s3 = i3[t4], s3.isBlockBreak() ? (r3 = true, n5.push(v(s3))) : n5.push(s3);
                  return n5;
                }(), r3 ? new e2.Text(c.call(i3).concat([o3])) : t3);
              }, p = e2.Text.textForStringWithAttributes("\n", { blockBreak: true }), l2 = function(t3) {
                return m(t3) ? t3 : t3.appendText(p);
              }, m = function(t3) {
                var e3, n4;
                return n4 = t3.getLength(), n4 === 0 ? false : (e3 = t3.getTextAtRange([n4 - 1, n4]), e3.isBlockBreak());
              }, v = function(t3) {
                return t3.copyWithoutAttribute("blockBreak");
              }, d = function(t3) {
                var e3;
                return e3 = i2(t3).listAttribute, e3 != null ? [e3, t3] : [t3];
              }, f = function(t3) {
                return t3.slice(-1)[0];
              }, g = function(t3, e3) {
                var n4;
                return n4 = t3.lastIndexOf(e3), n4 === -1 ? t3 : r2(t3, n4, 1);
              }, a3;
            }(e2.Object);
          }.call(this), function() {
            var t2, n2, i2, o2 = function(t3, e3) {
              function n3() {
                this.constructor = t3;
              }
              for (var i3 in e3)
                r2.call(e3, i3) && (t3[i3] = e3[i3]);
              return n3.prototype = e3.prototype, t3.prototype = new n3(), t3.__super__ = e3.prototype, t3;
            }, r2 = {}.hasOwnProperty, s2 = [].indexOf || function(t3) {
              for (var e3 = 0, n3 = this.length; n3 > e3; e3++)
                if (e3 in this && this[e3] === t3)
                  return e3;
              return -1;
            }, a2 = [].slice;
            n2 = e2.tagName, i2 = e2.walkTree, t2 = e2.nodeIsAttachmentElement, e2.HTMLSanitizer = function(r3) {
              function u(t3, e3) {
                var n3;
                n3 = e3 != null ? e3 : {}, this.allowedAttributes = n3.allowedAttributes, this.forbiddenProtocols = n3.forbiddenProtocols, this.forbiddenElements = n3.forbiddenElements, this.allowedAttributes == null && (this.allowedAttributes = c), this.forbiddenProtocols == null && (this.forbiddenProtocols = h2), this.forbiddenElements == null && (this.forbiddenElements = l2), this.body = p(t3);
              }
              var c, l2, h2, p;
              return o2(u, r3), c = "style href src width height class".split(" "), h2 = "javascript:".split(" "), l2 = "script iframe".split(" "), u.sanitize = function(t3, e3) {
                var n3;
                return n3 = new this(t3, e3), n3.sanitize(), n3;
              }, u.prototype.sanitize = function() {
                return this.sanitizeElements(), this.normalizeListElementNesting();
              }, u.prototype.getHTML = function() {
                return this.body.innerHTML;
              }, u.prototype.getBody = function() {
                return this.body;
              }, u.prototype.sanitizeElements = function() {
                var t3, n3, o3, r4, s3;
                for (s3 = i2(this.body), r4 = []; s3.nextNode(); )
                  switch (o3 = s3.currentNode, o3.nodeType) {
                    case Node.ELEMENT_NODE:
                      this.elementIsRemovable(o3) ? r4.push(o3) : this.sanitizeElement(o3);
                      break;
                    case Node.COMMENT_NODE:
                      r4.push(o3);
                  }
                for (t3 = 0, n3 = r4.length; n3 > t3; t3++)
                  o3 = r4[t3], e2.removeNode(o3);
                return this.body;
              }, u.prototype.sanitizeElement = function(t3) {
                var e3, n3, i3, o3, r4;
                for (t3.hasAttribute("href") && (o3 = t3.protocol, s2.call(this.forbiddenProtocols, o3) >= 0 && t3.removeAttribute("href")), r4 = a2.call(t3.attributes), e3 = 0, n3 = r4.length; n3 > e3; e3++)
                  i3 = r4[e3].name, s2.call(this.allowedAttributes, i3) >= 0 || i3.indexOf("data-trix") === 0 || t3.removeAttribute(i3);
                return t3;
              }, u.prototype.normalizeListElementNesting = function() {
                var t3, e3, i3, o3, r4;
                for (r4 = a2.call(this.body.querySelectorAll("ul,ol")), t3 = 0, e3 = r4.length; e3 > t3; t3++)
                  i3 = r4[t3], (o3 = i3.previousElementSibling) && n2(o3) === "li" && o3.appendChild(i3);
                return this.body;
              }, u.prototype.elementIsRemovable = function(t3) {
                return (t3 != null ? t3.nodeType : void 0) === Node.ELEMENT_NODE ? this.elementIsForbidden(t3) || this.elementIsntSerializable(t3) : void 0;
              }, u.prototype.elementIsForbidden = function(t3) {
                var e3;
                return e3 = n2(t3), s2.call(this.forbiddenElements, e3) >= 0;
              }, u.prototype.elementIsntSerializable = function(e3) {
                return e3.getAttribute("data-trix-serialize") === "false" && !t2(e3);
              }, p = function(t3) {
                var e3, n3, i3, o3, r4;
                for (t3 == null && (t3 = ""), t3 = t3.replace(/<\/html[^>]*>[^]*$/i, "</html>"), e3 = document.implementation.createHTMLDocument(""), e3.documentElement.innerHTML = t3, r4 = e3.head.querySelectorAll("style"), i3 = 0, o3 = r4.length; o3 > i3; i3++)
                  n3 = r4[i3], e3.body.appendChild(n3);
                return e3.body;
              }, u;
            }(e2.BasicObject);
          }.call(this), function() {
            var t2, n2, i2, o2, r2, s2, a2, u, c, l2, h2, p = function(t3, e3) {
              function n3() {
                this.constructor = t3;
              }
              for (var i3 in e3)
                d.call(e3, i3) && (t3[i3] = e3[i3]);
              return n3.prototype = e3.prototype, t3.prototype = new n3(), t3.__super__ = e3.prototype, t3;
            }, d = {}.hasOwnProperty, f = [].indexOf || function(t3) {
              for (var e3 = 0, n3 = this.length; n3 > e3; e3++)
                if (e3 in this && this[e3] === t3)
                  return e3;
              return -1;
            };
            t2 = e2.arraysAreEqual, s2 = e2.makeElement, l2 = e2.tagName, r2 = e2.getBlockTagNames, h2 = e2.walkTree, o2 = e2.findClosestElementFromNode, i2 = e2.elementContainsNode, a2 = e2.nodeIsAttachmentElement, u = e2.normalizeSpaces, n2 = e2.breakableWhitespacePattern, c = e2.squishBreakableWhitespace, e2.HTMLParser = function(d2) {
              function g(t3, e3) {
                this.html = t3, this.referenceElement = (e3 != null ? e3 : {}).referenceElement, this.blocks = [], this.blockElements = [], this.processedElements = [];
              }
              var m, v, y, b, A, C, x, w, E, S, R, k;
              return p(g, d2), g.parse = function(t3, e3) {
                var n3;
                return n3 = new this(t3, e3), n3.parse(), n3;
              }, g.prototype.getDocument = function() {
                return e2.Document.fromJSON(this.blocks);
              }, g.prototype.parse = function() {
                var t3, n3;
                try {
                  for (this.createHiddenContainer(), t3 = e2.HTMLSanitizer.sanitize(this.html).getHTML(), this.containerElement.innerHTML = t3, n3 = h2(this.containerElement, { usingFilter: x }); n3.nextNode(); )
                    this.processNode(n3.currentNode);
                  return this.translateBlockElementMarginsToNewlines();
                } finally {
                  this.removeHiddenContainer();
                }
              }, g.prototype.createHiddenContainer = function() {
                return this.referenceElement ? (this.containerElement = this.referenceElement.cloneNode(false), this.containerElement.removeAttribute("id"), this.containerElement.setAttribute("data-trix-internal", ""), this.containerElement.style.display = "none", this.referenceElement.parentNode.insertBefore(this.containerElement, this.referenceElement.nextSibling)) : (this.containerElement = s2({ tagName: "div", style: { display: "none" } }), document.body.appendChild(this.containerElement));
              }, g.prototype.removeHiddenContainer = function() {
                return e2.removeNode(this.containerElement);
              }, x = function(t3) {
                return l2(t3) === "style" ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
              }, g.prototype.processNode = function(t3) {
                switch (t3.nodeType) {
                  case Node.TEXT_NODE:
                    if (!this.isInsignificantTextNode(t3))
                      return this.appendBlockForTextNode(t3), this.processTextNode(t3);
                    break;
                  case Node.ELEMENT_NODE:
                    return this.appendBlockForElement(t3), this.processElement(t3);
                }
              }, g.prototype.appendBlockForTextNode = function(e3) {
                var n3, i3, o3;
                return i3 = e3.parentNode, i3 === this.currentBlockElement && this.isBlockElement(e3.previousSibling) ? this.appendStringWithAttributes("\n") : i3 !== this.containerElement && !this.isBlockElement(i3) || (n3 = this.getBlockAttributes(i3), t2(n3, (o3 = this.currentBlock) != null ? o3.attributes : void 0)) ? void 0 : (this.currentBlock = this.appendBlockForAttributesWithElement(n3, i3), this.currentBlockElement = i3);
              }, g.prototype.appendBlockForElement = function(e3) {
                var n3, o3, r3, s3;
                if (r3 = this.isBlockElement(e3), o3 = i2(this.currentBlockElement, e3), r3 && !this.isBlockElement(e3.firstChild)) {
                  if ((!this.isInsignificantTextNode(e3.firstChild) || !this.isBlockElement(e3.firstElementChild)) && (n3 = this.getBlockAttributes(e3), e3.firstChild))
                    return o3 && t2(n3, this.currentBlock.attributes) ? this.appendStringWithAttributes("\n") : (this.currentBlock = this.appendBlockForAttributesWithElement(n3, e3), this.currentBlockElement = e3);
                } else if (this.currentBlockElement && !o3 && !r3)
                  return (s3 = this.findParentBlockElement(e3)) ? this.appendBlockForElement(s3) : (this.currentBlock = this.appendEmptyBlock(), this.currentBlockElement = null);
              }, g.prototype.findParentBlockElement = function(t3) {
                var e3;
                for (e3 = t3.parentElement; e3 && e3 !== this.containerElement; ) {
                  if (this.isBlockElement(e3) && f.call(this.blockElements, e3) >= 0)
                    return e3;
                  e3 = e3.parentElement;
                }
                return null;
              }, g.prototype.processTextNode = function(t3) {
                var e3, n3;
                return n3 = t3.data, v(t3.parentNode) || (n3 = c(n3), R((e3 = t3.previousSibling) != null ? e3.textContent : void 0) && (n3 = A(n3))), this.appendStringWithAttributes(n3, this.getTextAttributes(t3.parentNode));
              }, g.prototype.processElement = function(t3) {
                var e3, n3, i3, o3, r3;
                if (a2(t3))
                  return e3 = w(t3, "attachment"), Object.keys(e3).length && (o3 = this.getTextAttributes(t3), this.appendAttachmentWithAttributes(e3, o3), t3.innerHTML = ""), this.processedElements.push(t3);
                switch (l2(t3)) {
                  case "br":
                    return this.isExtraBR(t3) || this.isBlockElement(t3.nextSibling) || this.appendStringWithAttributes("\n", this.getTextAttributes(t3)), this.processedElements.push(t3);
                  case "img":
                    e3 = { url: t3.getAttribute("src"), contentType: "image" }, i3 = b(t3);
                    for (n3 in i3)
                      r3 = i3[n3], e3[n3] = r3;
                    return this.appendAttachmentWithAttributes(e3, this.getTextAttributes(t3)), this.processedElements.push(t3);
                  case "tr":
                    if (t3.parentNode.firstChild !== t3)
                      return this.appendStringWithAttributes("\n");
                    break;
                  case "td":
                    if (t3.parentNode.firstChild !== t3)
                      return this.appendStringWithAttributes(" | ");
                }
              }, g.prototype.appendBlockForAttributesWithElement = function(t3, e3) {
                var n3;
                return this.blockElements.push(e3), n3 = m(t3), this.blocks.push(n3), n3;
              }, g.prototype.appendEmptyBlock = function() {
                return this.appendBlockForAttributesWithElement([], null);
              }, g.prototype.appendStringWithAttributes = function(t3, e3) {
                return this.appendPiece(S(t3, e3));
              }, g.prototype.appendAttachmentWithAttributes = function(t3, e3) {
                return this.appendPiece(E(t3, e3));
              }, g.prototype.appendPiece = function(t3) {
                return this.blocks.length === 0 && this.appendEmptyBlock(), this.blocks[this.blocks.length - 1].text.push(t3);
              }, g.prototype.appendStringToTextAtIndex = function(t3, e3) {
                var n3, i3;
                return i3 = this.blocks[e3].text, n3 = i3[i3.length - 1], (n3 != null ? n3.type : void 0) === "string" ? n3.string += t3 : i3.push(S(t3));
              }, g.prototype.prependStringToTextAtIndex = function(t3, e3) {
                var n3, i3;
                return i3 = this.blocks[e3].text, n3 = i3[0], (n3 != null ? n3.type : void 0) === "string" ? n3.string = t3 + n3.string : i3.unshift(S(t3));
              }, S = function(t3, e3) {
                var n3;
                return e3 == null && (e3 = {}), n3 = "string", t3 = u(t3), { string: t3, attributes: e3, type: n3 };
              }, E = function(t3, e3) {
                var n3;
                return e3 == null && (e3 = {}), n3 = "attachment", { attachment: t3, attributes: e3, type: n3 };
              }, m = function(t3) {
                var e3;
                return t3 == null && (t3 = {}), e3 = [], { text: e3, attributes: t3 };
              }, g.prototype.getTextAttributes = function(t3) {
                var n3, i3, r3, s3, u2, c2, l3, h3, p2, d3, f2, g2;
                r3 = {}, p2 = e2.config.textAttributes;
                for (n3 in p2)
                  if (u2 = p2[n3], u2.tagName && o2(t3, { matchingSelector: u2.tagName, untilNode: this.containerElement }))
                    r3[n3] = true;
                  else if (u2.parser) {
                    if (g2 = u2.parser(t3)) {
                      for (i3 = false, d3 = this.findBlockElementAncestors(t3), c2 = 0, h3 = d3.length; h3 > c2; c2++)
                        if (s3 = d3[c2], u2.parser(s3) === g2) {
                          i3 = true;
                          break;
                        }
                      i3 || (r3[n3] = g2);
                    }
                  } else
                    u2.styleProperty && (g2 = t3.style[u2.styleProperty]) && (r3[n3] = g2);
                if (a2(t3)) {
                  f2 = w(t3, "attributes");
                  for (l3 in f2)
                    g2 = f2[l3], r3[l3] = g2;
                }
                return r3;
              }, g.prototype.getBlockAttributes = function(t3) {
                var n3, i3, o3, r3;
                for (i3 = []; t3 && t3 !== this.containerElement; ) {
                  r3 = e2.config.blockAttributes;
                  for (n3 in r3)
                    o3 = r3[n3], o3.parse !== false && l2(t3) === o3.tagName && ((typeof o3.test == "function" ? o3.test(t3) : void 0) || !o3.test) && (i3.push(n3), o3.listAttribute && i3.push(o3.listAttribute));
                  t3 = t3.parentNode;
                }
                return i3.reverse();
              }, g.prototype.findBlockElementAncestors = function(t3) {
                var e3, n3;
                for (e3 = []; t3 && t3 !== this.containerElement; )
                  n3 = l2(t3), f.call(r2(), n3) >= 0 && e3.push(t3), t3 = t3.parentNode;
                return e3;
              }, w = function(t3, e3) {
                try {
                  return JSON.parse(t3.getAttribute("data-trix-" + e3));
                } catch (n3) {
                  return {};
                }
              }, b = function(t3) {
                var e3, n3, i3;
                return i3 = t3.getAttribute("width"), n3 = t3.getAttribute("height"), e3 = {}, i3 && (e3.width = parseInt(i3, 10)), n3 && (e3.height = parseInt(n3, 10)), e3;
              }, g.prototype.isBlockElement = function(t3) {
                var e3;
                if ((t3 != null ? t3.nodeType : void 0) === Node.ELEMENT_NODE && !a2(t3) && !o2(t3, { matchingSelector: "td", untilNode: this.containerElement }))
                  return e3 = l2(t3), f.call(r2(), e3) >= 0 || window.getComputedStyle(t3).display === "block";
              }, g.prototype.isInsignificantTextNode = function(t3) {
                var e3, n3, i3;
                if ((t3 != null ? t3.nodeType : void 0) === Node.TEXT_NODE && k(t3.data) && (n3 = t3.parentNode, i3 = t3.previousSibling, e3 = t3.nextSibling, (!C(n3.previousSibling) || this.isBlockElement(n3.previousSibling)) && !v(n3)))
                  return !i3 || this.isBlockElement(i3) || !e3 || this.isBlockElement(e3);
              }, g.prototype.isExtraBR = function(t3) {
                return l2(t3) === "br" && this.isBlockElement(t3.parentNode) && t3.parentNode.lastChild === t3;
              }, v = function(t3) {
                var e3;
                return e3 = window.getComputedStyle(t3).whiteSpace, e3 === "pre" || e3 === "pre-wrap" || e3 === "pre-line";
              }, C = function(t3) {
                return t3 && !R(t3.textContent);
              }, g.prototype.translateBlockElementMarginsToNewlines = function() {
                var t3, e3, n3, i3, o3, r3, s3, a3;
                for (e3 = this.getMarginOfDefaultBlockElement(), s3 = this.blocks, a3 = [], i3 = n3 = 0, o3 = s3.length; o3 > n3; i3 = ++n3)
                  t3 = s3[i3], (r3 = this.getMarginOfBlockElementAtIndex(i3)) && (r3.top > 2 * e3.top && this.prependStringToTextAtIndex("\n", i3), a3.push(r3.bottom > 2 * e3.bottom ? this.appendStringToTextAtIndex("\n", i3) : void 0));
                return a3;
              }, g.prototype.getMarginOfBlockElementAtIndex = function(t3) {
                var e3, n3;
                return !(e3 = this.blockElements[t3]) || !e3.textContent || (n3 = l2(e3), f.call(r2(), n3) >= 0 || f.call(this.processedElements, e3) >= 0) ? void 0 : y(e3);
              }, g.prototype.getMarginOfDefaultBlockElement = function() {
                var t3;
                return t3 = s2(e2.config.blockAttributes["default"].tagName), this.containerElement.appendChild(t3), y(t3);
              }, y = function(t3) {
                var e3;
                return e3 = window.getComputedStyle(t3), e3.display === "block" ? { top: parseInt(e3.marginTop), bottom: parseInt(e3.marginBottom) } : void 0;
              }, A = function(t3) {
                return t3.replace(RegExp("^" + n2.source + "+"), "");
              }, k = function(t3) {
                return RegExp("^" + n2.source + "*$").test(t3);
              }, R = function(t3) {
                return /\s$/.test(t3);
              }, g;
            }(e2.BasicObject);
          }.call(this), function() {
            var t2, n2, i2, o2, r2 = function(t3, e3) {
              function n3() {
                this.constructor = t3;
              }
              for (var i3 in e3)
                s2.call(e3, i3) && (t3[i3] = e3[i3]);
              return n3.prototype = e3.prototype, t3.prototype = new n3(), t3.__super__ = e3.prototype, t3;
            }, s2 = {}.hasOwnProperty, a2 = [].slice, u = [].indexOf || function(t3) {
              for (var e3 = 0, n3 = this.length; n3 > e3; e3++)
                if (e3 in this && this[e3] === t3)
                  return e3;
              return -1;
            };
            t2 = e2.arraysAreEqual, i2 = e2.normalizeRange, o2 = e2.rangeIsCollapsed, n2 = e2.getBlockConfig, e2.Document = function(s3) {
              function c(t3) {
                t3 == null && (t3 = []), c.__super__.constructor.apply(this, arguments), t3.length === 0 && (t3 = [new e2.Block()]), this.blockList = e2.SplittableList.box(t3);
              }
              var l2;
              return r2(c, s3), c.fromJSON = function(t3) {
                var n3, i3;
                return i3 = function() {
                  var i4, o3, r3;
                  for (r3 = [], i4 = 0, o3 = t3.length; o3 > i4; i4++)
                    n3 = t3[i4], r3.push(e2.Block.fromJSON(n3));
                  return r3;
                }(), new this(i3);
              }, c.fromHTML = function(t3, n3) {
                return e2.HTMLParser.parse(t3, n3).getDocument();
              }, c.fromString = function(t3, n3) {
                var i3;
                return i3 = e2.Text.textForStringWithAttributes(t3, n3), new this([new e2.Block(i3)]);
              }, c.prototype.isEmpty = function() {
                var t3;
                return this.blockList.length === 1 && (t3 = this.getBlockAtIndex(0), t3.isEmpty() && !t3.hasAttributes());
              }, c.prototype.copy = function(t3) {
                var e3;
                return t3 == null && (t3 = {}), e3 = t3.consolidateBlocks ? this.blockList.consolidate().toArray() : this.blockList.toArray(), new this.constructor(e3);
              }, c.prototype.copyUsingObjectsFromDocument = function(t3) {
                var n3;
                return n3 = new e2.ObjectMap(t3.getObjects()), this.copyUsingObjectMap(n3);
              }, c.prototype.copyUsingObjectMap = function(t3) {
                var e3, n3, i3;
                return n3 = function() {
                  var n4, o3, r3, s4;
                  for (r3 = this.getBlocks(), s4 = [], n4 = 0, o3 = r3.length; o3 > n4; n4++)
                    e3 = r3[n4], s4.push((i3 = t3.find(e3)) ? i3 : e3.copyUsingObjectMap(t3));
                  return s4;
                }.call(this), new this.constructor(n3);
              }, c.prototype.copyWithBaseBlockAttributes = function(t3) {
                var e3, n3, i3;
                return t3 == null && (t3 = []), i3 = function() {
                  var i4, o3, r3, s4;
                  for (r3 = this.getBlocks(), s4 = [], i4 = 0, o3 = r3.length; o3 > i4; i4++)
                    n3 = r3[i4], e3 = t3.concat(n3.getAttributes()), s4.push(n3.copyWithAttributes(e3));
                  return s4;
                }.call(this), new this.constructor(i3);
              }, c.prototype.replaceBlock = function(t3, e3) {
                var n3;
                return n3 = this.blockList.indexOf(t3), n3 === -1 ? this : new this.constructor(this.blockList.replaceObjectAtIndex(e3, n3));
              }, c.prototype.insertDocumentAtRange = function(t3, e3) {
                var n3, r3, s4, a3, u2, c2, l3;
                return r3 = t3.blockList, u2 = (e3 = i2(e3))[0], c2 = this.locationFromPosition(u2), s4 = c2.index, a3 = c2.offset, l3 = this, n3 = this.getBlockAtPosition(u2), o2(e3) && n3.isEmpty() && !n3.hasAttributes() ? l3 = new this.constructor(l3.blockList.removeObjectAtIndex(s4)) : n3.getBlockBreakPosition() === a3 && u2++, l3 = l3.removeTextAtRange(e3), new this.constructor(l3.blockList.insertSplittableListAtPosition(r3, u2));
              }, c.prototype.mergeDocumentAtRange = function(e3, n3) {
                var o3, r3, s4, a3, u2, c2, l3, h2, p, d, f, g;
                return f = (n3 = i2(n3))[0], d = this.locationFromPosition(f), r3 = this.getBlockAtIndex(d.index).getAttributes(), o3 = e3.getBaseBlockAttributes(), g = r3.slice(-o3.length), t2(o3, g) ? (l3 = r3.slice(0, -o3.length), c2 = e3.copyWithBaseBlockAttributes(l3)) : c2 = e3.copy({ consolidateBlocks: true }).copyWithBaseBlockAttributes(r3), s4 = c2.getBlockCount(), a3 = c2.getBlockAtIndex(0), t2(r3, a3.getAttributes()) ? (u2 = a3.getTextWithoutBlockBreak(), p = this.insertTextAtRange(u2, n3), s4 > 1 && (c2 = new this.constructor(c2.getBlocks().slice(1)), h2 = f + u2.getLength(), p = p.insertDocumentAtRange(c2, h2))) : p = this.insertDocumentAtRange(c2, n3), p;
              }, c.prototype.insertTextAtRange = function(t3, e3) {
                var n3, o3, r3, s4, a3;
                return a3 = (e3 = i2(e3))[0], s4 = this.locationFromPosition(a3), o3 = s4.index, r3 = s4.offset, n3 = this.removeTextAtRange(e3), new this.constructor(n3.blockList.editObjectAtIndex(o3, function(e4) {
                  return e4.copyWithText(e4.text.insertTextAtPosition(t3, r3));
                }));
              }, c.prototype.removeTextAtRange = function(t3) {
                var e3, n3, r3, s4, a3, u2, c2, l3, h2, p, d, f, g, m, v, y, b, A, C, x, w;
                return p = t3 = i2(t3), l3 = p[0], A = p[1], o2(t3) ? this : (d = this.locationRangeFromRange(t3), u2 = d[0], y = d[1], a3 = u2.index, c2 = u2.offset, s4 = this.getBlockAtIndex(a3), v = y.index, b = y.offset, m = this.getBlockAtIndex(v), f = A - l3 === 1 && s4.getBlockBreakPosition() === c2 && m.getBlockBreakPosition() !== b && m.text.getStringAtPosition(b) === "\n", f ? r3 = this.blockList.editObjectAtIndex(v, function(t4) {
                  return t4.copyWithText(t4.text.removeTextAtRange([b, b + 1]));
                }) : (h2 = s4.text.getTextAtRange([0, c2]), C = m.text.getTextAtRange([b, m.getLength()]), x = h2.appendText(C), g = a3 !== v && c2 === 0, w = g && s4.getAttributeLevel() >= m.getAttributeLevel(), n3 = w ? m.copyWithText(x) : s4.copyWithText(x), e3 = v + 1 - a3, r3 = this.blockList.splice(a3, e3, n3)), new this.constructor(r3));
              }, c.prototype.moveTextFromRangeToPosition = function(t3, e3) {
                var n3, o3, r3, s4, u2, c2, l3, h2, p, d;
                return c2 = t3 = i2(t3), p = c2[0], r3 = c2[1], e3 >= p && r3 >= e3 ? this : (o3 = this.getDocumentAtRange(t3), h2 = this.removeTextAtRange(t3), u2 = e3 > p, u2 && (e3 -= o3.getLength()), l3 = o3.getBlocks(), s4 = l3[0], n3 = 2 <= l3.length ? a2.call(l3, 1) : [], n3.length === 0 ? (d = s4.getTextWithoutBlockBreak(), u2 && (e3 += 1)) : d = s4.text, h2 = h2.insertTextAtRange(d, e3), n3.length === 0 ? h2 : (o3 = new this.constructor(n3), e3 += d.getLength(), h2.insertDocumentAtRange(o3, e3)));
              }, c.prototype.addAttributeAtRange = function(t3, e3, i3) {
                var o3;
                return o3 = this.blockList, this.eachBlockAtRange(i3, function(i4, r3, s4) {
                  return o3 = o3.editObjectAtIndex(s4, function() {
                    return n2(t3) ? i4.addAttribute(t3, e3) : r3[0] === r3[1] ? i4 : i4.copyWithText(i4.text.addAttributeAtRange(t3, e3, r3));
                  });
                }), new this.constructor(o3);
              }, c.prototype.addAttribute = function(t3, e3) {
                var n3;
                return n3 = this.blockList, this.eachBlock(function(i3, o3) {
                  return n3 = n3.editObjectAtIndex(o3, function() {
                    return i3.addAttribute(t3, e3);
                  });
                }), new this.constructor(n3);
              }, c.prototype.removeAttributeAtRange = function(t3, e3) {
                var i3;
                return i3 = this.blockList, this.eachBlockAtRange(e3, function(e4, o3, r3) {
                  return n2(t3) ? i3 = i3.editObjectAtIndex(r3, function() {
                    return e4.removeAttribute(t3);
                  }) : o3[0] !== o3[1] ? i3 = i3.editObjectAtIndex(r3, function() {
                    return e4.copyWithText(e4.text.removeAttributeAtRange(t3, o3));
                  }) : void 0;
                }), new this.constructor(i3);
              }, c.prototype.updateAttributesForAttachment = function(t3, e3) {
                var n3, i3, o3, r3;
                return o3 = (i3 = this.getRangeOfAttachment(e3))[0], n3 = this.locationFromPosition(o3).index, r3 = this.getTextAtIndex(n3), new this.constructor(this.blockList.editObjectAtIndex(n3, function(n4) {
                  return n4.copyWithText(r3.updateAttributesForAttachment(t3, e3));
                }));
              }, c.prototype.removeAttributeForAttachment = function(t3, e3) {
                var n3;
                return n3 = this.getRangeOfAttachment(e3), this.removeAttributeAtRange(t3, n3);
              }, c.prototype.insertBlockBreakAtRange = function(t3) {
                var n3, o3, r3, s4;
                return s4 = (t3 = i2(t3))[0], r3 = this.locationFromPosition(s4).offset, o3 = this.removeTextAtRange(t3), r3 === 0 && (n3 = [new e2.Block()]), new this.constructor(o3.blockList.insertSplittableListAtPosition(new e2.SplittableList(n3), s4));
              }, c.prototype.applyBlockAttributeAtRange = function(t3, e3, i3) {
                var o3, r3, s4, a3;
                return s4 = this.expandRangeToLineBreaksAndSplitBlocks(i3), r3 = s4.document, i3 = s4.range, o3 = n2(t3), o3.listAttribute ? (r3 = r3.removeLastListAttributeAtRange(i3, { exceptAttributeName: t3 }), a3 = r3.convertLineBreaksToBlockBreaksInRange(i3), r3 = a3.document, i3 = a3.range) : r3 = o3.exclusive ? r3.removeBlockAttributesAtRange(i3) : o3.terminal ? r3.removeLastTerminalAttributeAtRange(i3) : r3.consolidateBlocksAtRange(i3), r3.addAttributeAtRange(t3, e3, i3);
              }, c.prototype.removeLastListAttributeAtRange = function(t3, e3) {
                var i3;
                return e3 == null && (e3 = {}), i3 = this.blockList, this.eachBlockAtRange(t3, function(t4, o3, r3) {
                  var s4;
                  if ((s4 = t4.getLastAttribute()) && n2(s4).listAttribute && s4 !== e3.exceptAttributeName)
                    return i3 = i3.editObjectAtIndex(r3, function() {
                      return t4.removeAttribute(s4);
                    });
                }), new this.constructor(i3);
              }, c.prototype.removeLastTerminalAttributeAtRange = function(t3) {
                var e3;
                return e3 = this.blockList, this.eachBlockAtRange(t3, function(t4, i3, o3) {
                  var r3;
                  if ((r3 = t4.getLastAttribute()) && n2(r3).terminal)
                    return e3 = e3.editObjectAtIndex(o3, function() {
                      return t4.removeAttribute(r3);
                    });
                }), new this.constructor(e3);
              }, c.prototype.removeBlockAttributesAtRange = function(t3) {
                var e3;
                return e3 = this.blockList, this.eachBlockAtRange(t3, function(t4, n3, i3) {
                  return t4.hasAttributes() ? e3 = e3.editObjectAtIndex(i3, function() {
                    return t4.copyWithoutAttributes();
                  }) : void 0;
                }), new this.constructor(e3);
              }, c.prototype.expandRangeToLineBreaksAndSplitBlocks = function(t3) {
                var e3, n3, o3, r3, s4, a3, u2, c2, l3;
                return a3 = t3 = i2(t3), l3 = a3[0], r3 = a3[1], c2 = this.locationFromPosition(l3), o3 = this.locationFromPosition(r3), e3 = this, u2 = e3.getBlockAtIndex(c2.index), (c2.offset = u2.findLineBreakInDirectionFromPosition("backward", c2.offset)) != null && (s4 = e3.positionFromLocation(c2), e3 = e3.insertBlockBreakAtRange([s4, s4 + 1]), o3.index += 1, o3.offset -= e3.getBlockAtIndex(c2.index).getLength(), c2.index += 1), c2.offset = 0, o3.offset === 0 && o3.index > c2.index ? (o3.index -= 1, o3.offset = e3.getBlockAtIndex(o3.index).getBlockBreakPosition()) : (n3 = e3.getBlockAtIndex(o3.index), n3.text.getStringAtRange([o3.offset - 1, o3.offset]) === "\n" ? o3.offset -= 1 : o3.offset = n3.findLineBreakInDirectionFromPosition("forward", o3.offset), o3.offset !== n3.getBlockBreakPosition() && (s4 = e3.positionFromLocation(o3), e3 = e3.insertBlockBreakAtRange([s4, s4 + 1]))), l3 = e3.positionFromLocation(c2), r3 = e3.positionFromLocation(o3), t3 = i2([l3, r3]), { document: e3, range: t3 };
              }, c.prototype.convertLineBreaksToBlockBreaksInRange = function(t3) {
                var e3, n3, o3;
                return n3 = (t3 = i2(t3))[0], o3 = this.getStringAtRange(t3).slice(0, -1), e3 = this, o3.replace(/.*?\n/g, function(t4) {
                  return n3 += t4.length, e3 = e3.insertBlockBreakAtRange([n3 - 1, n3]);
                }), { document: e3, range: t3 };
              }, c.prototype.consolidateBlocksAtRange = function(t3) {
                var e3, n3, o3, r3, s4;
                return o3 = t3 = i2(t3), s4 = o3[0], n3 = o3[1], r3 = this.locationFromPosition(s4).index, e3 = this.locationFromPosition(n3).index, new this.constructor(this.blockList.consolidateFromIndexToIndex(r3, e3));
              }, c.prototype.getDocumentAtRange = function(t3) {
                var e3;
                return t3 = i2(t3), e3 = this.blockList.getSplittableListInRange(t3).toArray(), new this.constructor(e3);
              }, c.prototype.getStringAtRange = function(t3) {
                var e3, n3, o3;
                return o3 = t3 = i2(t3), n3 = o3[o3.length - 1], n3 !== this.getLength() && (e3 = -1), this.getDocumentAtRange(t3).toString().slice(0, e3);
              }, c.prototype.getBlockAtIndex = function(t3) {
                return this.blockList.getObjectAtIndex(t3);
              }, c.prototype.getBlockAtPosition = function(t3) {
                var e3;
                return e3 = this.locationFromPosition(t3).index, this.getBlockAtIndex(e3);
              }, c.prototype.getTextAtIndex = function(t3) {
                var e3;
                return (e3 = this.getBlockAtIndex(t3)) != null ? e3.text : void 0;
              }, c.prototype.getTextAtPosition = function(t3) {
                var e3;
                return e3 = this.locationFromPosition(t3).index, this.getTextAtIndex(e3);
              }, c.prototype.getPieceAtPosition = function(t3) {
                var e3, n3, i3;
                return i3 = this.locationFromPosition(t3), e3 = i3.index, n3 = i3.offset, this.getTextAtIndex(e3).getPieceAtPosition(n3);
              }, c.prototype.getCharacterAtPosition = function(t3) {
                var e3, n3, i3;
                return i3 = this.locationFromPosition(t3), e3 = i3.index, n3 = i3.offset, this.getTextAtIndex(e3).getStringAtRange([n3, n3 + 1]);
              }, c.prototype.getLength = function() {
                return this.blockList.getEndPosition();
              }, c.prototype.getBlocks = function() {
                return this.blockList.toArray();
              }, c.prototype.getBlockCount = function() {
                return this.blockList.length;
              }, c.prototype.getEditCount = function() {
                return this.editCount;
              }, c.prototype.eachBlock = function(t3) {
                return this.blockList.eachObject(t3);
              }, c.prototype.eachBlockAtRange = function(t3, e3) {
                var n3, o3, r3, s4, a3, u2, c2, l3, h2, p, d, f;
                if (u2 = t3 = i2(t3), d = u2[0], r3 = u2[1], p = this.locationFromPosition(d), o3 = this.locationFromPosition(r3), p.index === o3.index)
                  return n3 = this.getBlockAtIndex(p.index), f = [p.offset, o3.offset], e3(n3, f, p.index);
                for (h2 = [], a3 = s4 = c2 = p.index, l3 = o3.index; l3 >= c2 ? l3 >= s4 : s4 >= l3; a3 = l3 >= c2 ? ++s4 : --s4)
                  (n3 = this.getBlockAtIndex(a3)) ? (f = function() {
                    switch (a3) {
                      case p.index:
                        return [p.offset, n3.text.getLength()];
                      case o3.index:
                        return [0, o3.offset];
                      default:
                        return [0, n3.text.getLength()];
                    }
                  }(), h2.push(e3(n3, f, a3))) : h2.push(void 0);
                return h2;
              }, c.prototype.getCommonAttributesAtRange = function(t3) {
                var n3, r3, s4;
                return r3 = (t3 = i2(t3))[0], o2(t3) ? this.getCommonAttributesAtPosition(r3) : (s4 = [], n3 = [], this.eachBlockAtRange(t3, function(t4, e3) {
                  return e3[0] !== e3[1] ? (s4.push(t4.text.getCommonAttributesAtRange(e3)), n3.push(l2(t4))) : void 0;
                }), e2.Hash.fromCommonAttributesOfObjects(s4).merge(e2.Hash.fromCommonAttributesOfObjects(n3)).toObject());
              }, c.prototype.getCommonAttributesAtPosition = function(t3) {
                var n3, i3, o3, r3, s4, a3, c2, h2, p, d;
                if (p = this.locationFromPosition(t3), s4 = p.index, h2 = p.offset, o3 = this.getBlockAtIndex(s4), !o3)
                  return {};
                r3 = l2(o3), n3 = o3.text.getAttributesAtPosition(h2), i3 = o3.text.getAttributesAtPosition(h2 - 1), a3 = function() {
                  var t4, n4;
                  t4 = e2.config.textAttributes, n4 = [];
                  for (c2 in t4)
                    d = t4[c2], d.inheritable && n4.push(c2);
                  return n4;
                }();
                for (c2 in i3)
                  d = i3[c2], (d === n3[c2] || u.call(a3, c2) >= 0) && (r3[c2] = d);
                return r3;
              }, c.prototype.getRangeOfCommonAttributeAtPosition = function(t3, e3) {
                var n3, o3, r3, s4, a3, u2, c2, l3, h2;
                return a3 = this.locationFromPosition(e3), r3 = a3.index, s4 = a3.offset, h2 = this.getTextAtIndex(r3), u2 = h2.getExpandedRangeForAttributeAtOffset(t3, s4), l3 = u2[0], o3 = u2[1], c2 = this.positionFromLocation({ index: r3, offset: l3 }), n3 = this.positionFromLocation({ index: r3, offset: o3 }), i2([c2, n3]);
              }, c.prototype.getBaseBlockAttributes = function() {
                var t3, e3, n3, i3, o3, r3, s4;
                for (t3 = this.getBlockAtIndex(0).getAttributes(), n3 = i3 = 1, s4 = this.getBlockCount(); s4 >= 1 ? s4 > i3 : i3 > s4; n3 = s4 >= 1 ? ++i3 : --i3)
                  e3 = this.getBlockAtIndex(n3).getAttributes(), r3 = Math.min(t3.length, e3.length), t3 = function() {
                    var n4, i4, s5;
                    for (s5 = [], o3 = n4 = 0, i4 = r3; (i4 >= 0 ? i4 > n4 : n4 > i4) && e3[o3] === t3[o3]; o3 = i4 >= 0 ? ++n4 : --n4)
                      s5.push(e3[o3]);
                    return s5;
                  }();
                return t3;
              }, l2 = function(t3) {
                var e3, n3;
                return n3 = {}, (e3 = t3.getLastAttribute()) && (n3[e3] = true), n3;
              }, c.prototype.getAttachmentById = function(t3) {
                var e3, n3, i3, o3;
                for (o3 = this.getAttachments(), n3 = 0, i3 = o3.length; i3 > n3; n3++)
                  if (e3 = o3[n3], e3.id === t3)
                    return e3;
              }, c.prototype.getAttachmentPieces = function() {
                var t3;
                return t3 = [], this.blockList.eachObject(function(e3) {
                  var n3;
                  return n3 = e3.text, t3 = t3.concat(n3.getAttachmentPieces());
                }), t3;
              }, c.prototype.getAttachments = function() {
                var t3, e3, n3, i3, o3;
                for (i3 = this.getAttachmentPieces(), o3 = [], t3 = 0, e3 = i3.length; e3 > t3; t3++)
                  n3 = i3[t3], o3.push(n3.attachment);
                return o3;
              }, c.prototype.getRangeOfAttachment = function(t3) {
                var e3, n3, o3, r3, s4, a3, u2;
                for (r3 = 0, s4 = this.blockList.toArray(), n3 = e3 = 0, o3 = s4.length; o3 > e3; n3 = ++e3) {
                  if (a3 = s4[n3].text, u2 = a3.getRangeOfAttachment(t3))
                    return i2([r3 + u2[0], r3 + u2[1]]);
                  r3 += a3.getLength();
                }
              }, c.prototype.getLocationRangeOfAttachment = function(t3) {
                var e3;
                return e3 = this.getRangeOfAttachment(t3), this.locationRangeFromRange(e3);
              }, c.prototype.getAttachmentPieceForAttachment = function(t3) {
                var e3, n3, i3, o3;
                for (o3 = this.getAttachmentPieces(), e3 = 0, n3 = o3.length; n3 > e3; e3++)
                  if (i3 = o3[e3], i3.attachment === t3)
                    return i3;
              }, c.prototype.findRangesForBlockAttribute = function(t3) {
                var e3, n3, i3, o3, r3, s4, a3;
                for (r3 = 0, s4 = [], a3 = this.getBlocks(), n3 = 0, i3 = a3.length; i3 > n3; n3++)
                  e3 = a3[n3], o3 = e3.getLength(), e3.hasAttribute(t3) && s4.push([r3, r3 + o3]), r3 += o3;
                return s4;
              }, c.prototype.findRangesForTextAttribute = function(t3, e3) {
                var n3, i3, o3, r3, s4, a3, u2, c2, l3, h2;
                for (h2 = (e3 != null ? e3 : {}).withValue, a3 = 0, u2 = [], c2 = [], r3 = function(e4) {
                  return h2 != null ? e4.getAttribute(t3) === h2 : e4.hasAttribute(t3);
                }, l3 = this.getPieces(), n3 = 0, i3 = l3.length; i3 > n3; n3++)
                  s4 = l3[n3], o3 = s4.getLength(), r3(s4) && (u2[1] === a3 ? u2[1] = a3 + o3 : c2.push(u2 = [a3, a3 + o3])), a3 += o3;
                return c2;
              }, c.prototype.locationFromPosition = function(t3) {
                var e3, n3;
                return n3 = this.blockList.findIndexAndOffsetAtPosition(Math.max(0, t3)), n3.index != null ? n3 : (e3 = this.getBlocks(), { index: e3.length - 1, offset: e3[e3.length - 1].getLength() });
              }, c.prototype.positionFromLocation = function(t3) {
                return this.blockList.findPositionAtIndexAndOffset(t3.index, t3.offset);
              }, c.prototype.locationRangeFromPosition = function(t3) {
                return i2(this.locationFromPosition(t3));
              }, c.prototype.locationRangeFromRange = function(t3) {
                var e3, n3, o3, r3;
                if (t3 = i2(t3))
                  return r3 = t3[0], n3 = t3[1], o3 = this.locationFromPosition(r3), e3 = this.locationFromPosition(n3), i2([o3, e3]);
              }, c.prototype.rangeFromLocationRange = function(t3) {
                var e3, n3;
                return t3 = i2(t3), e3 = this.positionFromLocation(t3[0]), o2(t3) || (n3 = this.positionFromLocation(t3[1])), i2([e3, n3]);
              }, c.prototype.isEqualTo = function(t3) {
                return this.blockList.isEqualTo(t3 != null ? t3.blockList : void 0);
              }, c.prototype.getTexts = function() {
                var t3, e3, n3, i3, o3;
                for (i3 = this.getBlocks(), o3 = [], e3 = 0, n3 = i3.length; n3 > e3; e3++)
                  t3 = i3[e3], o3.push(t3.text);
                return o3;
              }, c.prototype.getPieces = function() {
                var t3, e3, n3, i3, o3;
                for (n3 = [], i3 = this.getTexts(), t3 = 0, e3 = i3.length; e3 > t3; t3++)
                  o3 = i3[t3], n3.push.apply(n3, o3.getPieces());
                return n3;
              }, c.prototype.getObjects = function() {
                return this.getBlocks().concat(this.getTexts()).concat(this.getPieces());
              }, c.prototype.toSerializableDocument = function() {
                var t3;
                return t3 = [], this.blockList.eachObject(function(e3) {
                  return t3.push(e3.copyWithText(e3.text.toSerializableText()));
                }), new this.constructor(t3);
              }, c.prototype.toString = function() {
                return this.blockList.toString();
              }, c.prototype.toJSON = function() {
                return this.blockList.toJSON();
              }, c.prototype.toConsole = function() {
                var t3;
                return JSON.stringify(function() {
                  var e3, n3, i3, o3;
                  for (i3 = this.blockList.toArray(), o3 = [], e3 = 0, n3 = i3.length; n3 > e3; e3++)
                    t3 = i3[e3], o3.push(JSON.parse(t3.text.toConsole()));
                  return o3;
                }.call(this));
              }, c;
            }(e2.Object);
          }.call(this), function() {
            e2.LineBreakInsertion = function() {
              function t2(t3) {
                var e3;
                this.composition = t3, this.document = this.composition.document, e3 = this.composition.getSelectedRange(), this.startPosition = e3[0], this.endPosition = e3[1], this.startLocation = this.document.locationFromPosition(this.startPosition), this.endLocation = this.document.locationFromPosition(this.endPosition), this.block = this.document.getBlockAtIndex(this.endLocation.index), this.breaksOnReturn = this.block.breaksOnReturn(), this.previousCharacter = this.block.text.getStringAtPosition(this.endLocation.offset - 1), this.nextCharacter = this.block.text.getStringAtPosition(this.endLocation.offset);
              }
              return t2.prototype.shouldInsertBlockBreak = function() {
                return this.block.hasAttributes() && this.block.isListItem() && !this.block.isEmpty() ? this.startLocation.offset !== 0 : this.breaksOnReturn && this.nextCharacter !== "\n";
              }, t2.prototype.shouldBreakFormattedBlock = function() {
                return this.block.hasAttributes() && !this.block.isListItem() && (this.breaksOnReturn && this.nextCharacter === "\n" || this.previousCharacter === "\n");
              }, t2.prototype.shouldDecreaseListLevel = function() {
                return this.block.hasAttributes() && this.block.isListItem() && this.block.isEmpty();
              }, t2.prototype.shouldPrependListItem = function() {
                return this.block.isListItem() && this.startLocation.offset === 0 && !this.block.isEmpty();
              }, t2.prototype.shouldRemoveLastBlockAttribute = function() {
                return this.block.hasAttributes() && !this.block.isListItem() && this.block.isEmpty();
              }, t2;
            }();
          }.call(this), function() {
            var t2, n2, i2, o2, r2, s2, a2, u, c, l2, h2 = function(t3, e3) {
              function n3() {
                this.constructor = t3;
              }
              for (var i3 in e3)
                p.call(e3, i3) && (t3[i3] = e3[i3]);
              return n3.prototype = e3.prototype, t3.prototype = new n3(), t3.__super__ = e3.prototype, t3;
            }, p = {}.hasOwnProperty;
            s2 = e2.normalizeRange, c = e2.rangesAreEqual, u = e2.rangeIsCollapsed, a2 = e2.objectsAreEqual, t2 = e2.arrayStartsWith, l2 = e2.summarizeArrayChange, i2 = e2.getAllAttributeNames, o2 = e2.getBlockConfig, r2 = e2.getTextConfig, n2 = e2.extend, e2.Composition = function(p2) {
              function d() {
                this.document = new e2.Document(), this.attachments = [], this.currentAttributes = {}, this.revision = 0;
              }
              var f;
              return h2(d, p2), d.prototype.setDocument = function(t3) {
                var e3;
                return t3.isEqualTo(this.document) ? void 0 : (this.document = t3, this.refreshAttachments(), this.revision++, (e3 = this.delegate) != null && typeof e3.compositionDidChangeDocument == "function" ? e3.compositionDidChangeDocument(t3) : void 0);
              }, d.prototype.getSnapshot = function() {
                return { document: this.document, selectedRange: this.getSelectedRange() };
              }, d.prototype.loadSnapshot = function(t3) {
                var n3, i3, o3, r3;
                return n3 = t3.document, r3 = t3.selectedRange, (i3 = this.delegate) != null && typeof i3.compositionWillLoadSnapshot == "function" && i3.compositionWillLoadSnapshot(), this.setDocument(n3 != null ? n3 : new e2.Document()), this.setSelection(r3 != null ? r3 : [0, 0]), (o3 = this.delegate) != null && typeof o3.compositionDidLoadSnapshot == "function" ? o3.compositionDidLoadSnapshot() : void 0;
              }, d.prototype.insertText = function(t3, e3) {
                var n3, i3, o3, r3;
                return r3 = (e3 != null ? e3 : { updatePosition: true }).updatePosition, i3 = this.getSelectedRange(), this.setDocument(this.document.insertTextAtRange(t3, i3)), o3 = i3[0], n3 = o3 + t3.getLength(), r3 && this.setSelection(n3), this.notifyDelegateOfInsertionAtRange([o3, n3]);
              }, d.prototype.insertBlock = function(t3) {
                var n3;
                return t3 == null && (t3 = new e2.Block()), n3 = new e2.Document([t3]), this.insertDocument(n3);
              }, d.prototype.insertDocument = function(t3) {
                var n3, i3, o3;
                return t3 == null && (t3 = new e2.Document()), i3 = this.getSelectedRange(), this.setDocument(this.document.insertDocumentAtRange(t3, i3)), o3 = i3[0], n3 = o3 + t3.getLength(), this.setSelection(n3), this.notifyDelegateOfInsertionAtRange([o3, n3]);
              }, d.prototype.insertString = function(t3, n3) {
                var i3, o3;
                return i3 = this.getCurrentTextAttributes(), o3 = e2.Text.textForStringWithAttributes(t3, i3), this.insertText(o3, n3);
              }, d.prototype.insertBlockBreak = function() {
                var t3, e3, n3;
                return e3 = this.getSelectedRange(), this.setDocument(this.document.insertBlockBreakAtRange(e3)), n3 = e3[0], t3 = n3 + 1, this.setSelection(t3), this.notifyDelegateOfInsertionAtRange([n3, t3]);
              }, d.prototype.insertLineBreak = function() {
                var t3, n3;
                return n3 = new e2.LineBreakInsertion(this), n3.shouldDecreaseListLevel() ? (this.decreaseListLevel(), this.setSelection(n3.startPosition)) : n3.shouldPrependListItem() ? (t3 = new e2.Document([n3.block.copyWithoutText()]), this.insertDocument(t3)) : n3.shouldInsertBlockBreak() ? this.insertBlockBreak() : n3.shouldRemoveLastBlockAttribute() ? this.removeLastBlockAttribute() : n3.shouldBreakFormattedBlock() ? this.breakFormattedBlock(n3) : this.insertString("\n");
              }, d.prototype.insertHTML = function(t3) {
                var n3, i3, o3, r3;
                return n3 = e2.Document.fromHTML(t3), o3 = this.getSelectedRange(), this.setDocument(this.document.mergeDocumentAtRange(n3, o3)), r3 = o3[0], i3 = r3 + n3.getLength() - 1, this.setSelection(i3), this.notifyDelegateOfInsertionAtRange([r3, i3]);
              }, d.prototype.replaceHTML = function(t3) {
                var n3, i3, o3;
                return n3 = e2.Document.fromHTML(t3).copyUsingObjectsFromDocument(this.document), i3 = this.getLocationRange({ strict: false }), o3 = this.document.rangeFromLocationRange(i3), this.setDocument(n3), this.setSelection(o3);
              }, d.prototype.insertFile = function(t3) {
                return this.insertFiles([t3]);
              }, d.prototype.insertFiles = function(t3) {
                var n3, i3, o3, r3, s3, a3;
                for (i3 = [], r3 = 0, s3 = t3.length; s3 > r3; r3++)
                  o3 = t3[r3], ((a3 = this.delegate) != null ? a3.compositionShouldAcceptFile(o3) : void 0) && (n3 = e2.Attachment.attachmentForFile(o3), i3.push(n3));
                return this.insertAttachments(i3);
              }, d.prototype.insertAttachment = function(t3) {
                return this.insertAttachments([t3]);
              }, d.prototype.insertAttachments = function(t3) {
                var n3, i3, o3, r3, s3, a3, u2, c2, l3;
                for (c2 = new e2.Text(), r3 = 0, s3 = t3.length; s3 > r3; r3++)
                  n3 = t3[r3], l3 = n3.getType(), a3 = (u2 = e2.config.attachments[l3]) != null ? u2.presentation : void 0, o3 = this.getCurrentTextAttributes(), a3 && (o3.presentation = a3), i3 = e2.Text.textForAttachmentWithAttributes(n3, o3), c2 = c2.appendText(i3);
                return this.insertText(c2);
              }, d.prototype.shouldManageDeletingInDirection = function(t3) {
                var e3;
                if (e3 = this.getLocationRange(), u(e3)) {
                  if (t3 === "backward" && e3[0].offset === 0)
                    return true;
                  if (this.shouldManageMovingCursorInDirection(t3))
                    return true;
                } else if (e3[0].index !== e3[1].index)
                  return true;
                return false;
              }, d.prototype.deleteInDirection = function(t3, e3) {
                var n3, i3, o3, r3, s3, a3, c2, l3;
                return r3 = (e3 != null ? e3 : {}).length, s3 = this.getLocationRange(), a3 = this.getSelectedRange(), c2 = u(a3), c2 ? o3 = t3 === "backward" && s3[0].offset === 0 : l3 = s3[0].index !== s3[1].index, o3 && this.canDecreaseBlockAttributeLevel() && (i3 = this.getBlock(), i3.isListItem() ? this.decreaseListLevel() : this.decreaseBlockAttributeLevel(), this.setSelection(a3[0]), i3.isEmpty()) ? false : (c2 && (a3 = this.getExpandedRangeInDirection(t3, { length: r3 }), t3 === "backward" && (n3 = this.getAttachmentAtRange(a3))), n3 ? (this.editAttachment(n3), false) : (this.setDocument(this.document.removeTextAtRange(a3)), this.setSelection(a3[0]), o3 || l3 ? false : void 0));
              }, d.prototype.moveTextFromRange = function(t3) {
                var e3;
                return e3 = this.getSelectedRange()[0], this.setDocument(this.document.moveTextFromRangeToPosition(t3, e3)), this.setSelection(e3);
              }, d.prototype.removeAttachment = function(t3) {
                var e3;
                return (e3 = this.document.getRangeOfAttachment(t3)) ? (this.stopEditingAttachment(), this.setDocument(this.document.removeTextAtRange(e3)), this.setSelection(e3[0])) : void 0;
              }, d.prototype.removeLastBlockAttribute = function() {
                var t3, e3, n3, i3;
                return n3 = this.getSelectedRange(), i3 = n3[0], e3 = n3[1], t3 = this.document.getBlockAtPosition(e3), this.removeCurrentAttribute(t3.getLastAttribute()), this.setSelection(i3);
              }, f = " ", d.prototype.insertPlaceholder = function() {
                return this.placeholderPosition = this.getPosition(), this.insertString(f);
              }, d.prototype.selectPlaceholder = function() {
                return this.placeholderPosition != null ? (this.setSelectedRange([this.placeholderPosition, this.placeholderPosition + f.length]), this.getSelectedRange()) : void 0;
              }, d.prototype.forgetPlaceholder = function() {
                return this.placeholderPosition = null;
              }, d.prototype.hasCurrentAttribute = function(t3) {
                var e3;
                return e3 = this.currentAttributes[t3], e3 != null && e3 !== false;
              }, d.prototype.toggleCurrentAttribute = function(t3) {
                var e3;
                return (e3 = !this.currentAttributes[t3]) ? this.setCurrentAttribute(t3, e3) : this.removeCurrentAttribute(t3);
              }, d.prototype.canSetCurrentAttribute = function(t3) {
                return o2(t3) ? this.canSetCurrentBlockAttribute(t3) : this.canSetCurrentTextAttribute(t3);
              }, d.prototype.canSetCurrentTextAttribute = function() {
                var t3, e3, n3, i3, o3;
                if (e3 = this.getSelectedDocument()) {
                  for (o3 = e3.getAttachments(), n3 = 0, i3 = o3.length; i3 > n3; n3++)
                    if (t3 = o3[n3], !t3.hasContent())
                      return false;
                  return true;
                }
              }, d.prototype.canSetCurrentBlockAttribute = function() {
                var t3;
                if (t3 = this.getBlock())
                  return !t3.isTerminalBlock();
              }, d.prototype.setCurrentAttribute = function(t3, e3) {
                return o2(t3) ? this.setBlockAttribute(t3, e3) : (this.setTextAttribute(t3, e3), this.currentAttributes[t3] = e3, this.notifyDelegateOfCurrentAttributesChange());
              }, d.prototype.setTextAttribute = function(t3, n3) {
                var i3, o3, r3, s3;
                if (o3 = this.getSelectedRange())
                  return r3 = o3[0], i3 = o3[1], r3 !== i3 ? this.setDocument(this.document.addAttributeAtRange(t3, n3, o3)) : t3 === "href" ? (s3 = e2.Text.textForStringWithAttributes(n3, { href: n3 }), this.insertText(s3)) : void 0;
              }, d.prototype.setBlockAttribute = function(t3, e3) {
                var n3, i3;
                if (i3 = this.getSelectedRange())
                  return this.canSetCurrentAttribute(t3) ? (n3 = this.getBlock(), this.setDocument(this.document.applyBlockAttributeAtRange(t3, e3, i3)), this.setSelection(i3)) : void 0;
              }, d.prototype.removeCurrentAttribute = function(t3) {
                return o2(t3) ? (this.removeBlockAttribute(t3), this.updateCurrentAttributes()) : (this.removeTextAttribute(t3), delete this.currentAttributes[t3], this.notifyDelegateOfCurrentAttributesChange());
              }, d.prototype.removeTextAttribute = function(t3) {
                var e3;
                if (e3 = this.getSelectedRange())
                  return this.setDocument(this.document.removeAttributeAtRange(t3, e3));
              }, d.prototype.removeBlockAttribute = function(t3) {
                var e3;
                if (e3 = this.getSelectedRange())
                  return this.setDocument(this.document.removeAttributeAtRange(t3, e3));
              }, d.prototype.canDecreaseNestingLevel = function() {
                var t3;
                return ((t3 = this.getBlock()) != null ? t3.getNestingLevel() : void 0) > 0;
              }, d.prototype.canIncreaseNestingLevel = function() {
                var e3, n3, i3;
                if (e3 = this.getBlock())
                  return ((i3 = o2(e3.getLastNestableAttribute())) != null ? i3.listAttribute : 0) ? (n3 = this.getPreviousBlock()) ? t2(n3.getListItemAttributes(), e3.getListItemAttributes()) : void 0 : e3.getNestingLevel() > 0;
              }, d.prototype.decreaseNestingLevel = function() {
                var t3;
                if (t3 = this.getBlock())
                  return this.setDocument(this.document.replaceBlock(t3, t3.decreaseNestingLevel()));
              }, d.prototype.increaseNestingLevel = function() {
                var t3;
                if (t3 = this.getBlock())
                  return this.setDocument(this.document.replaceBlock(t3, t3.increaseNestingLevel()));
              }, d.prototype.canDecreaseBlockAttributeLevel = function() {
                var t3;
                return ((t3 = this.getBlock()) != null ? t3.getAttributeLevel() : void 0) > 0;
              }, d.prototype.decreaseBlockAttributeLevel = function() {
                var t3, e3;
                return (t3 = (e3 = this.getBlock()) != null ? e3.getLastAttribute() : void 0) ? this.removeCurrentAttribute(t3) : void 0;
              }, d.prototype.decreaseListLevel = function() {
                var t3, e3, n3, i3, o3, r3;
                for (r3 = this.getSelectedRange()[0], o3 = this.document.locationFromPosition(r3).index, n3 = o3, t3 = this.getBlock().getAttributeLevel(); (e3 = this.document.getBlockAtIndex(n3 + 1)) && e3.isListItem() && e3.getAttributeLevel() > t3; )
                  n3++;
                return r3 = this.document.positionFromLocation({ index: o3, offset: 0 }), i3 = this.document.positionFromLocation({ index: n3, offset: 0 }), this.setDocument(this.document.removeLastListAttributeAtRange([r3, i3]));
              }, d.prototype.updateCurrentAttributes = function() {
                var t3, e3, n3, o3, r3, s3;
                if (s3 = this.getSelectedRange({ ignoreLock: true })) {
                  for (e3 = this.document.getCommonAttributesAtRange(s3), r3 = i2(), n3 = 0, o3 = r3.length; o3 > n3; n3++)
                    t3 = r3[n3], e3[t3] || this.canSetCurrentAttribute(t3) || (e3[t3] = false);
                  if (!a2(e3, this.currentAttributes))
                    return this.currentAttributes = e3, this.notifyDelegateOfCurrentAttributesChange();
                }
              }, d.prototype.getCurrentAttributes = function() {
                return n2.call({}, this.currentAttributes);
              }, d.prototype.getCurrentTextAttributes = function() {
                var t3, e3, n3, i3;
                t3 = {}, n3 = this.currentAttributes;
                for (e3 in n3)
                  i3 = n3[e3], i3 !== false && r2(e3) && (t3[e3] = i3);
                return t3;
              }, d.prototype.freezeSelection = function() {
                return this.setCurrentAttribute("frozen", true);
              }, d.prototype.thawSelection = function() {
                return this.removeCurrentAttribute("frozen");
              }, d.prototype.hasFrozenSelection = function() {
                return this.hasCurrentAttribute("frozen");
              }, d.proxyMethod("getSelectionManager().getPointRange"), d.proxyMethod("getSelectionManager().setLocationRangeFromPointRange"), d.proxyMethod("getSelectionManager().createLocationRangeFromDOMRange"), d.proxyMethod("getSelectionManager().locationIsCursorTarget"), d.proxyMethod("getSelectionManager().selectionIsExpanded"), d.proxyMethod("delegate?.getSelectionManager"), d.prototype.setSelection = function(t3) {
                var e3, n3;
                return e3 = this.document.locationRangeFromRange(t3), (n3 = this.delegate) != null ? n3.compositionDidRequestChangingSelectionToLocationRange(e3) : void 0;
              }, d.prototype.getSelectedRange = function() {
                var t3;
                return (t3 = this.getLocationRange()) ? this.document.rangeFromLocationRange(t3) : void 0;
              }, d.prototype.setSelectedRange = function(t3) {
                var e3;
                return e3 = this.document.locationRangeFromRange(t3), this.getSelectionManager().setLocationRange(e3);
              }, d.prototype.getPosition = function() {
                var t3;
                return (t3 = this.getLocationRange()) ? this.document.positionFromLocation(t3[0]) : void 0;
              }, d.prototype.getLocationRange = function(t3) {
                var e3, n3;
                return (e3 = (n3 = this.targetLocationRange) != null ? n3 : this.getSelectionManager().getLocationRange(t3)) != null ? e3 : s2({ index: 0, offset: 0 });
              }, d.prototype.withTargetLocationRange = function(t3, e3) {
                var n3;
                this.targetLocationRange = t3;
                try {
                  n3 = e3();
                } finally {
                  this.targetLocationRange = null;
                }
                return n3;
              }, d.prototype.withTargetRange = function(t3, e3) {
                var n3;
                return n3 = this.document.locationRangeFromRange(t3), this.withTargetLocationRange(n3, e3);
              }, d.prototype.withTargetDOMRange = function(t3, e3) {
                var n3;
                return n3 = this.createLocationRangeFromDOMRange(t3, { strict: false }), this.withTargetLocationRange(n3, e3);
              }, d.prototype.getExpandedRangeInDirection = function(t3, e3) {
                var n3, i3, o3, r3;
                return i3 = (e3 != null ? e3 : {}).length, o3 = this.getSelectedRange(), r3 = o3[0], n3 = o3[1], t3 === "backward" ? i3 ? r3 -= i3 : r3 = this.translateUTF16PositionFromOffset(r3, -1) : i3 ? n3 += i3 : n3 = this.translateUTF16PositionFromOffset(n3, 1), s2([r3, n3]);
              }, d.prototype.shouldManageMovingCursorInDirection = function(t3) {
                var e3;
                return this.editingAttachment ? true : (e3 = this.getExpandedRangeInDirection(t3), this.getAttachmentAtRange(e3) != null);
              }, d.prototype.moveCursorInDirection = function(t3) {
                var e3, n3, i3, o3;
                return this.editingAttachment ? i3 = this.document.getRangeOfAttachment(this.editingAttachment) : (o3 = this.getSelectedRange(), i3 = this.getExpandedRangeInDirection(t3), n3 = !c(o3, i3)), this.setSelectedRange(t3 === "backward" ? i3[0] : i3[1]), n3 && (e3 = this.getAttachmentAtRange(i3)) ? this.editAttachment(e3) : void 0;
              }, d.prototype.expandSelectionInDirection = function(t3, e3) {
                var n3, i3;
                return n3 = (e3 != null ? e3 : {}).length, i3 = this.getExpandedRangeInDirection(t3, { length: n3 }), this.setSelectedRange(i3);
              }, d.prototype.expandSelectionForEditing = function() {
                return this.hasCurrentAttribute("href") ? this.expandSelectionAroundCommonAttribute("href") : void 0;
              }, d.prototype.expandSelectionAroundCommonAttribute = function(t3) {
                var e3, n3;
                return e3 = this.getPosition(), n3 = this.document.getRangeOfCommonAttributeAtPosition(t3, e3), this.setSelectedRange(n3);
              }, d.prototype.selectionContainsAttachments = function() {
                var t3;
                return ((t3 = this.getSelectedAttachments()) != null ? t3.length : void 0) > 0;
              }, d.prototype.selectionIsInCursorTarget = function() {
                return this.editingAttachment || this.positionIsCursorTarget(this.getPosition());
              }, d.prototype.positionIsCursorTarget = function(t3) {
                var e3;
                return (e3 = this.document.locationFromPosition(t3)) ? this.locationIsCursorTarget(e3) : void 0;
              }, d.prototype.positionIsBlockBreak = function(t3) {
                var e3;
                return (e3 = this.document.getPieceAtPosition(t3)) != null ? e3.isBlockBreak() : void 0;
              }, d.prototype.getSelectedDocument = function() {
                var t3;
                return (t3 = this.getSelectedRange()) ? this.document.getDocumentAtRange(t3) : void 0;
              }, d.prototype.getSelectedAttachments = function() {
                var t3;
                return (t3 = this.getSelectedDocument()) != null ? t3.getAttachments() : void 0;
              }, d.prototype.getAttachments = function() {
                return this.attachments.slice(0);
              }, d.prototype.refreshAttachments = function() {
                var t3, e3, n3, i3, o3, r3, s3, a3, u2, c2, h3, p3;
                for (n3 = this.document.getAttachments(), a3 = l2(this.attachments, n3), t3 = a3.added, h3 = a3.removed, this.attachments = n3, i3 = 0, r3 = h3.length; r3 > i3; i3++)
                  e3 = h3[i3], e3.delegate = null, (u2 = this.delegate) != null && typeof u2.compositionDidRemoveAttachment == "function" && u2.compositionDidRemoveAttachment(e3);
                for (p3 = [], o3 = 0, s3 = t3.length; s3 > o3; o3++)
                  e3 = t3[o3], e3.delegate = this, p3.push((c2 = this.delegate) != null && typeof c2.compositionDidAddAttachment == "function" ? c2.compositionDidAddAttachment(e3) : void 0);
                return p3;
              }, d.prototype.attachmentDidChangeAttributes = function(t3) {
                var e3;
                return this.revision++, (e3 = this.delegate) != null && typeof e3.compositionDidEditAttachment == "function" ? e3.compositionDidEditAttachment(t3) : void 0;
              }, d.prototype.attachmentDidChangePreviewURL = function(t3) {
                var e3;
                return this.revision++, (e3 = this.delegate) != null && typeof e3.compositionDidChangeAttachmentPreviewURL == "function" ? e3.compositionDidChangeAttachmentPreviewURL(t3) : void 0;
              }, d.prototype.editAttachment = function(t3, e3) {
                var n3;
                if (t3 !== this.editingAttachment)
                  return this.stopEditingAttachment(), this.editingAttachment = t3, (n3 = this.delegate) != null && typeof n3.compositionDidStartEditingAttachment == "function" ? n3.compositionDidStartEditingAttachment(this.editingAttachment, e3) : void 0;
              }, d.prototype.stopEditingAttachment = function() {
                var t3;
                if (this.editingAttachment)
                  return (t3 = this.delegate) != null && typeof t3.compositionDidStopEditingAttachment == "function" && t3.compositionDidStopEditingAttachment(this.editingAttachment), this.editingAttachment = null;
              }, d.prototype.updateAttributesForAttachment = function(t3, e3) {
                return this.setDocument(this.document.updateAttributesForAttachment(t3, e3));
              }, d.prototype.removeAttributeForAttachment = function(t3, e3) {
                return this.setDocument(this.document.removeAttributeForAttachment(t3, e3));
              }, d.prototype.breakFormattedBlock = function(t3) {
                var n3, i3, o3, r3, s3;
                return i3 = t3.document, n3 = t3.block, r3 = t3.startPosition, s3 = [r3 - 1, r3], n3.getBlockBreakPosition() === t3.startLocation.offset ? (n3.breaksOnReturn() && t3.nextCharacter === "\n" ? r3 += 1 : i3 = i3.removeTextAtRange(s3), s3 = [r3, r3]) : t3.nextCharacter === "\n" ? t3.previousCharacter === "\n" ? s3 = [r3 - 1, r3 + 1] : (s3 = [r3, r3 + 1], r3 += 1) : t3.startLocation.offset - 1 !== 0 && (r3 += 1), o3 = new e2.Document([n3.removeLastAttribute().copyWithoutText()]), this.setDocument(i3.insertDocumentAtRange(o3, s3)), this.setSelection(r3);
              }, d.prototype.getPreviousBlock = function() {
                var t3, e3;
                return (e3 = this.getLocationRange()) && (t3 = e3[0].index, t3 > 0) ? this.document.getBlockAtIndex(t3 - 1) : void 0;
              }, d.prototype.getBlock = function() {
                var t3;
                return (t3 = this.getLocationRange()) ? this.document.getBlockAtIndex(t3[0].index) : void 0;
              }, d.prototype.getAttachmentAtRange = function(t3) {
                var n3;
                return n3 = this.document.getDocumentAtRange(t3), n3.toString() === e2.OBJECT_REPLACEMENT_CHARACTER + "\n" ? n3.getAttachments()[0] : void 0;
              }, d.prototype.notifyDelegateOfCurrentAttributesChange = function() {
                var t3;
                return (t3 = this.delegate) != null && typeof t3.compositionDidChangeCurrentAttributes == "function" ? t3.compositionDidChangeCurrentAttributes(this.currentAttributes) : void 0;
              }, d.prototype.notifyDelegateOfInsertionAtRange = function(t3) {
                var e3;
                return (e3 = this.delegate) != null && typeof e3.compositionDidPerformInsertionAtRange == "function" ? e3.compositionDidPerformInsertionAtRange(t3) : void 0;
              }, d.prototype.translateUTF16PositionFromOffset = function(t3, e3) {
                var n3, i3;
                return i3 = this.document.toUTF16String(), n3 = i3.offsetFromUCS2Offset(t3), i3.offsetToUCS2Offset(n3 + e3);
              }, d;
            }(e2.BasicObject);
          }.call(this), function() {
            var t2 = function(t3, e3) {
              function i2() {
                this.constructor = t3;
              }
              for (var o2 in e3)
                n2.call(e3, o2) && (t3[o2] = e3[o2]);
              return i2.prototype = e3.prototype, t3.prototype = new i2(), t3.__super__ = e3.prototype, t3;
            }, n2 = {}.hasOwnProperty;
            e2.UndoManager = function(e3) {
              function n3(t3) {
                this.composition = t3, this.undoEntries = [], this.redoEntries = [];
              }
              var i2;
              return t2(n3, e3), n3.prototype.recordUndoEntry = function(t3, e4) {
                var n4, o2, r2, s2, a2;
                return s2 = e4 != null ? e4 : {}, o2 = s2.context, n4 = s2.consolidatable, r2 = this.undoEntries.slice(-1)[0], n4 && i2(r2, t3, o2) ? void 0 : (a2 = this.createEntry({ description: t3, context: o2 }), this.undoEntries.push(a2), this.redoEntries = []);
              }, n3.prototype.undo = function() {
                var t3, e4;
                return (e4 = this.undoEntries.pop()) ? (t3 = this.createEntry(e4), this.redoEntries.push(t3), this.composition.loadSnapshot(e4.snapshot)) : void 0;
              }, n3.prototype.redo = function() {
                var t3, e4;
                return (t3 = this.redoEntries.pop()) ? (e4 = this.createEntry(t3), this.undoEntries.push(e4), this.composition.loadSnapshot(t3.snapshot)) : void 0;
              }, n3.prototype.canUndo = function() {
                return this.undoEntries.length > 0;
              }, n3.prototype.canRedo = function() {
                return this.redoEntries.length > 0;
              }, n3.prototype.createEntry = function(t3) {
                var e4, n4, i3;
                return i3 = t3 != null ? t3 : {}, n4 = i3.description, e4 = i3.context, { description: n4 != null ? n4.toString() : void 0, context: JSON.stringify(e4), snapshot: this.composition.getSnapshot() };
              }, i2 = function(t3, e4, n4) {
                return (t3 != null ? t3.description : void 0) === (e4 != null ? e4.toString() : void 0) && (t3 != null ? t3.context : void 0) === JSON.stringify(n4);
              }, n3;
            }(e2.BasicObject);
          }.call(this), function() {
            var t2;
            e2.attachmentGalleryFilter = function(e3) {
              var n2;
              return n2 = new t2(e3), n2.perform(), n2.getSnapshot();
            }, t2 = function() {
              function t3(t4) {
                this.document = t4.document, this.selectedRange = t4.selectedRange;
              }
              var e3, n2, i2;
              return e3 = "attachmentGallery", n2 = "presentation", i2 = "gallery", t3.prototype.perform = function() {
                return this.removeBlockAttribute(), this.applyBlockAttribute();
              }, t3.prototype.getSnapshot = function() {
                return { document: this.document, selectedRange: this.selectedRange };
              }, t3.prototype.removeBlockAttribute = function() {
                var t4, n3, i3, o2, r2;
                for (o2 = this.findRangesOfBlocks(), r2 = [], t4 = 0, n3 = o2.length; n3 > t4; t4++)
                  i3 = o2[t4], r2.push(this.document = this.document.removeAttributeAtRange(e3, i3));
                return r2;
              }, t3.prototype.applyBlockAttribute = function() {
                var t4, n3, i3, o2, r2, s2;
                for (i3 = 0, r2 = this.findRangesOfPieces(), s2 = [], t4 = 0, n3 = r2.length; n3 > t4; t4++)
                  o2 = r2[t4], o2[1] - o2[0] > 1 && (o2[0] += i3, o2[1] += i3, this.document.getCharacterAtPosition(o2[1]) !== "\n" && (this.document = this.document.insertBlockBreakAtRange(o2[1]), o2[1] < this.selectedRange[1] && this.moveSelectedRangeForward(), o2[1]++, i3++), o2[0] !== 0 && this.document.getCharacterAtPosition(o2[0] - 1) !== "\n" && (this.document = this.document.insertBlockBreakAtRange(o2[0]), o2[0] < this.selectedRange[0] && this.moveSelectedRangeForward(), o2[0]++, i3++), s2.push(this.document = this.document.applyBlockAttributeAtRange(e3, true, o2)));
                return s2;
              }, t3.prototype.findRangesOfBlocks = function() {
                return this.document.findRangesForBlockAttribute(e3);
              }, t3.prototype.findRangesOfPieces = function() {
                return this.document.findRangesForTextAttribute(n2, { withValue: i2 });
              }, t3.prototype.moveSelectedRangeForward = function() {
                return this.selectedRange[0] += 1, this.selectedRange[1] += 1;
              }, t3;
            }();
          }.call(this), function() {
            var t2 = function(t3, e3) {
              return function() {
                return t3.apply(e3, arguments);
              };
            };
            e2.Editor = function() {
              function n2(n3, o2, r2) {
                this.composition = n3, this.selectionManager = o2, this.element = r2, this.insertFiles = t2(this.insertFiles, this), this.undoManager = new e2.UndoManager(this.composition), this.filters = i2.slice(0);
              }
              var i2;
              return i2 = [e2.attachmentGalleryFilter], n2.prototype.loadDocument = function(t3) {
                return this.loadSnapshot({ document: t3, selectedRange: [0, 0] });
              }, n2.prototype.loadHTML = function(t3) {
                return t3 == null && (t3 = ""), this.loadDocument(e2.Document.fromHTML(t3, { referenceElement: this.element }));
              }, n2.prototype.loadJSON = function(t3) {
                var n3, i3;
                return n3 = t3.document, i3 = t3.selectedRange, n3 = e2.Document.fromJSON(n3), this.loadSnapshot({ document: n3, selectedRange: i3 });
              }, n2.prototype.loadSnapshot = function(t3) {
                return this.undoManager = new e2.UndoManager(this.composition), this.composition.loadSnapshot(t3);
              }, n2.prototype.getDocument = function() {
                return this.composition.document;
              }, n2.prototype.getSelectedDocument = function() {
                return this.composition.getSelectedDocument();
              }, n2.prototype.getSnapshot = function() {
                return this.composition.getSnapshot();
              }, n2.prototype.toJSON = function() {
                return this.getSnapshot();
              }, n2.prototype.deleteInDirection = function(t3) {
                return this.composition.deleteInDirection(t3);
              }, n2.prototype.insertAttachment = function(t3) {
                return this.composition.insertAttachment(t3);
              }, n2.prototype.insertAttachments = function(t3) {
                return this.composition.insertAttachments(t3);
              }, n2.prototype.insertDocument = function(t3) {
                return this.composition.insertDocument(t3);
              }, n2.prototype.insertFile = function(t3) {
                return this.composition.insertFile(t3);
              }, n2.prototype.insertFiles = function(t3) {
                return this.composition.insertFiles(t3);
              }, n2.prototype.insertHTML = function(t3) {
                return this.composition.insertHTML(t3);
              }, n2.prototype.insertString = function(t3) {
                return this.composition.insertString(t3);
              }, n2.prototype.insertText = function(t3) {
                return this.composition.insertText(t3);
              }, n2.prototype.insertLineBreak = function() {
                return this.composition.insertLineBreak();
              }, n2.prototype.getSelectedRange = function() {
                return this.composition.getSelectedRange();
              }, n2.prototype.getPosition = function() {
                return this.composition.getPosition();
              }, n2.prototype.getClientRectAtPosition = function(t3) {
                var e3;
                return e3 = this.getDocument().locationRangeFromRange([t3, t3 + 1]), this.selectionManager.getClientRectAtLocationRange(e3);
              }, n2.prototype.expandSelectionInDirection = function(t3) {
                return this.composition.expandSelectionInDirection(t3);
              }, n2.prototype.moveCursorInDirection = function(t3) {
                return this.composition.moveCursorInDirection(t3);
              }, n2.prototype.setSelectedRange = function(t3) {
                return this.composition.setSelectedRange(t3);
              }, n2.prototype.activateAttribute = function(t3, e3) {
                return e3 == null && (e3 = true), this.composition.setCurrentAttribute(t3, e3);
              }, n2.prototype.attributeIsActive = function(t3) {
                return this.composition.hasCurrentAttribute(t3);
              }, n2.prototype.canActivateAttribute = function(t3) {
                return this.composition.canSetCurrentAttribute(t3);
              }, n2.prototype.deactivateAttribute = function(t3) {
                return this.composition.removeCurrentAttribute(t3);
              }, n2.prototype.canDecreaseNestingLevel = function() {
                return this.composition.canDecreaseNestingLevel();
              }, n2.prototype.canIncreaseNestingLevel = function() {
                return this.composition.canIncreaseNestingLevel();
              }, n2.prototype.decreaseNestingLevel = function() {
                return this.canDecreaseNestingLevel() ? this.composition.decreaseNestingLevel() : void 0;
              }, n2.prototype.increaseNestingLevel = function() {
                return this.canIncreaseNestingLevel() ? this.composition.increaseNestingLevel() : void 0;
              }, n2.prototype.canRedo = function() {
                return this.undoManager.canRedo();
              }, n2.prototype.canUndo = function() {
                return this.undoManager.canUndo();
              }, n2.prototype.recordUndoEntry = function(t3, e3) {
                var n3, i3, o2;
                return o2 = e3 != null ? e3 : {}, i3 = o2.context, n3 = o2.consolidatable, this.undoManager.recordUndoEntry(t3, { context: i3, consolidatable: n3 });
              }, n2.prototype.redo = function() {
                return this.canRedo() ? this.undoManager.redo() : void 0;
              }, n2.prototype.undo = function() {
                return this.canUndo() ? this.undoManager.undo() : void 0;
              }, n2;
            }();
          }.call(this), function() {
            var t2 = function(t3, e3) {
              function i2() {
                this.constructor = t3;
              }
              for (var o2 in e3)
                n2.call(e3, o2) && (t3[o2] = e3[o2]);
              return i2.prototype = e3.prototype, t3.prototype = new i2(), t3.__super__ = e3.prototype, t3;
            }, n2 = {}.hasOwnProperty;
            e2.ManagedAttachment = function(e3) {
              function n3(t3, e4) {
                var n4;
                this.attachmentManager = t3, this.attachment = e4, n4 = this.attachment, this.id = n4.id, this.file = n4.file;
              }
              return t2(n3, e3), n3.prototype.remove = function() {
                return this.attachmentManager.requestRemovalOfAttachment(this.attachment);
              }, n3.proxyMethod("attachment.getAttribute"), n3.proxyMethod("attachment.hasAttribute"), n3.proxyMethod("attachment.setAttribute"), n3.proxyMethod("attachment.getAttributes"), n3.proxyMethod("attachment.setAttributes"), n3.proxyMethod("attachment.isPending"), n3.proxyMethod("attachment.isPreviewable"), n3.proxyMethod("attachment.getURL"), n3.proxyMethod("attachment.getHref"), n3.proxyMethod("attachment.getFilename"), n3.proxyMethod("attachment.getFilesize"), n3.proxyMethod("attachment.getFormattedFilesize"), n3.proxyMethod("attachment.getExtension"), n3.proxyMethod("attachment.getContentType"), n3.proxyMethod("attachment.getFile"), n3.proxyMethod("attachment.setFile"), n3.proxyMethod("attachment.releaseFile"), n3.proxyMethod("attachment.getUploadProgress"), n3.proxyMethod("attachment.setUploadProgress"), n3;
            }(e2.BasicObject);
          }.call(this), function() {
            var t2 = function(t3, e3) {
              function i2() {
                this.constructor = t3;
              }
              for (var o2 in e3)
                n2.call(e3, o2) && (t3[o2] = e3[o2]);
              return i2.prototype = e3.prototype, t3.prototype = new i2(), t3.__super__ = e3.prototype, t3;
            }, n2 = {}.hasOwnProperty;
            e2.AttachmentManager = function(n3) {
              function i2(t3) {
                var e3, n4, i3;
                for (t3 == null && (t3 = []), this.managedAttachments = {}, n4 = 0, i3 = t3.length; i3 > n4; n4++)
                  e3 = t3[n4], this.manageAttachment(e3);
              }
              return t2(i2, n3), i2.prototype.getAttachments = function() {
                var t3, e3, n4, i3;
                n4 = this.managedAttachments, i3 = [];
                for (e3 in n4)
                  t3 = n4[e3], i3.push(t3);
                return i3;
              }, i2.prototype.manageAttachment = function(t3) {
                var n4, i3;
                return (n4 = this.managedAttachments)[i3 = t3.id] != null ? n4[i3] : n4[i3] = new e2.ManagedAttachment(this, t3);
              }, i2.prototype.attachmentIsManaged = function(t3) {
                return t3.id in this.managedAttachments;
              }, i2.prototype.requestRemovalOfAttachment = function(t3) {
                var e3;
                return this.attachmentIsManaged(t3) && (e3 = this.delegate) != null && typeof e3.attachmentManagerDidRequestRemovalOfAttachment == "function" ? e3.attachmentManagerDidRequestRemovalOfAttachment(t3) : void 0;
              }, i2.prototype.unmanageAttachment = function(t3) {
                var e3;
                return e3 = this.managedAttachments[t3.id], delete this.managedAttachments[t3.id], e3;
              }, i2;
            }(e2.BasicObject);
          }.call(this), function() {
            var t2, n2, i2, o2, r2, s2, a2, u, c, l2, h2;
            t2 = e2.elementContainsNode, n2 = e2.findChildIndexOfNode, r2 = e2.nodeIsBlockStart, s2 = e2.nodeIsBlockStartComment, o2 = e2.nodeIsBlockContainer, a2 = e2.nodeIsCursorTarget, u = e2.nodeIsEmptyTextNode, c = e2.nodeIsTextNode, i2 = e2.nodeIsAttachmentElement, l2 = e2.tagName, h2 = e2.walkTree, e2.LocationMapper = function() {
              function e3(t3) {
                this.element = t3;
              }
              var p, d, f, g;
              return e3.prototype.findLocationFromContainerAndOffset = function(e4, i3, o3) {
                var s3, u2, l3, p2, g2, m, v;
                for (m = (o3 != null ? o3 : { strict: true }).strict, u2 = 0, l3 = false, p2 = { index: 0, offset: 0 }, (s3 = this.findAttachmentElementParentForNode(e4)) && (e4 = s3.parentNode, i3 = n2(s3)), v = h2(this.element, { usingFilter: f }); v.nextNode(); ) {
                  if (g2 = v.currentNode, g2 === e4 && c(e4)) {
                    a2(g2) || (p2.offset += i3);
                    break;
                  }
                  if (g2.parentNode === e4) {
                    if (u2++ === i3)
                      break;
                  } else if (!t2(e4, g2) && u2 > 0)
                    break;
                  r2(g2, { strict: m }) ? (l3 && p2.index++, p2.offset = 0, l3 = true) : p2.offset += d(g2);
                }
                return p2;
              }, e3.prototype.findContainerAndOffsetFromLocation = function(t3) {
                var e4, i3, s3, u2, l3;
                if (t3.index === 0 && t3.offset === 0) {
                  for (e4 = this.element, u2 = 0; e4.firstChild; )
                    if (e4 = e4.firstChild, o2(e4)) {
                      u2 = 1;
                      break;
                    }
                  return [e4, u2];
                }
                if (l3 = this.findNodeAndOffsetFromLocation(t3), i3 = l3[0], s3 = l3[1], i3) {
                  if (c(i3))
                    d(i3) === 0 ? (e4 = i3.parentNode.parentNode, u2 = n2(i3.parentNode), a2(i3, { name: "right" }) && u2++) : (e4 = i3, u2 = t3.offset - s3);
                  else {
                    if (e4 = i3.parentNode, !r2(i3.previousSibling) && !o2(e4))
                      for (; i3 === e4.lastChild && (i3 = e4, e4 = e4.parentNode, !o2(e4)); )
                        ;
                    u2 = n2(i3), t3.offset !== 0 && u2++;
                  }
                  return [e4, u2];
                }
              }, e3.prototype.findNodeAndOffsetFromLocation = function(t3) {
                var e4, n3, i3, o3, r3, s3, u2, l3;
                for (u2 = 0, l3 = this.getSignificantNodesForIndex(t3.index), n3 = 0, i3 = l3.length; i3 > n3; n3++) {
                  if (e4 = l3[n3], o3 = d(e4), t3.offset <= u2 + o3)
                    if (c(e4)) {
                      if (r3 = e4, s3 = u2, t3.offset === s3 && a2(r3))
                        break;
                    } else
                      r3 || (r3 = e4, s3 = u2);
                  if (u2 += o3, u2 > t3.offset)
                    break;
                }
                return [r3, s3];
              }, e3.prototype.findAttachmentElementParentForNode = function(t3) {
                for (; t3 && t3 !== this.element; ) {
                  if (i2(t3))
                    return t3;
                  t3 = t3.parentNode;
                }
              }, e3.prototype.getSignificantNodesForIndex = function(t3) {
                var e4, n3, i3, o3, r3;
                for (i3 = [], r3 = h2(this.element, { usingFilter: p }), o3 = false; r3.nextNode(); )
                  if (n3 = r3.currentNode, s2(n3)) {
                    if (typeof e4 != "undefined" && e4 !== null ? e4++ : e4 = 0, e4 === t3)
                      o3 = true;
                    else if (o3)
                      break;
                  } else
                    o3 && i3.push(n3);
                return i3;
              }, d = function(t3) {
                var e4;
                return t3.nodeType === Node.TEXT_NODE ? a2(t3) ? 0 : (e4 = t3.textContent, e4.length) : l2(t3) === "br" || i2(t3) ? 1 : 0;
              }, p = function(t3) {
                return g(t3) === NodeFilter.FILTER_ACCEPT ? f(t3) : NodeFilter.FILTER_REJECT;
              }, g = function(t3) {
                return u(t3) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
              }, f = function(t3) {
                return i2(t3.parentNode) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
              }, e3;
            }();
          }.call(this), function() {
            var t2, n2, i2 = [].slice;
            t2 = e2.getDOMRange, n2 = e2.setDOMRange, e2.PointMapper = function() {
              function e3() {
              }
              return e3.prototype.createDOMRangeFromPoint = function(e4) {
                var i3, o2, r2, s2, a2, u, c, l2;
                if (c = e4.x, l2 = e4.y, document.caretPositionFromPoint)
                  return a2 = document.caretPositionFromPoint(c, l2), r2 = a2.offsetNode, o2 = a2.offset, i3 = document.createRange(), i3.setStart(r2, o2), i3;
                if (document.caretRangeFromPoint)
                  return document.caretRangeFromPoint(c, l2);
                if (document.body.createTextRange) {
                  s2 = t2();
                  try {
                    u = document.body.createTextRange(), u.moveToPoint(c, l2), u.select();
                  } catch (h2) {
                  }
                  return i3 = t2(), n2(s2), i3;
                }
              }, e3.prototype.getClientRectsForDOMRange = function(t3) {
                var e4, n3, o2;
                return n3 = i2.call(t3.getClientRects()), o2 = n3[0], e4 = n3[n3.length - 1], [o2, e4];
              }, e3;
            }();
          }.call(this), function() {
            var t2, n2 = function(t3, e3) {
              return function() {
                return t3.apply(e3, arguments);
              };
            }, i2 = function(t3, e3) {
              function n3() {
                this.constructor = t3;
              }
              for (var i3 in e3)
                o2.call(e3, i3) && (t3[i3] = e3[i3]);
              return n3.prototype = e3.prototype, t3.prototype = new n3(), t3.__super__ = e3.prototype, t3;
            }, o2 = {}.hasOwnProperty, r2 = [].indexOf || function(t3) {
              for (var e3 = 0, n3 = this.length; n3 > e3; e3++)
                if (e3 in this && this[e3] === t3)
                  return e3;
              return -1;
            };
            t2 = e2.getDOMRange, e2.SelectionChangeObserver = function(e3) {
              function o3() {
                this.run = n2(this.run, this), this.update = n2(this.update, this), this.selectionManagers = [];
              }
              var s2;
              return i2(o3, e3), o3.prototype.start = function() {
                return this.started ? void 0 : (this.started = true, "onselectionchange" in document ? document.addEventListener("selectionchange", this.update, true) : this.run());
              }, o3.prototype.stop = function() {
                return this.started ? (this.started = false, document.removeEventListener("selectionchange", this.update, true)) : void 0;
              }, o3.prototype.registerSelectionManager = function(t3) {
                return r2.call(this.selectionManagers, t3) < 0 ? (this.selectionManagers.push(t3), this.start()) : void 0;
              }, o3.prototype.unregisterSelectionManager = function(t3) {
                var e4;
                return this.selectionManagers = function() {
                  var n3, i3, o4, r3;
                  for (o4 = this.selectionManagers, r3 = [], n3 = 0, i3 = o4.length; i3 > n3; n3++)
                    e4 = o4[n3], e4 !== t3 && r3.push(e4);
                  return r3;
                }.call(this), this.selectionManagers.length === 0 ? this.stop() : void 0;
              }, o3.prototype.notifySelectionManagersOfSelectionChange = function() {
                var t3, e4, n3, i3, o4;
                for (n3 = this.selectionManagers, i3 = [], t3 = 0, e4 = n3.length; e4 > t3; t3++)
                  o4 = n3[t3], i3.push(o4.selectionDidChange());
                return i3;
              }, o3.prototype.update = function() {
                var e4;
                return e4 = t2(), s2(e4, this.domRange) ? void 0 : (this.domRange = e4, this.notifySelectionManagersOfSelectionChange());
              }, o3.prototype.reset = function() {
                return this.domRange = null, this.update();
              }, o3.prototype.run = function() {
                return this.started ? (this.update(), requestAnimationFrame(this.run)) : void 0;
              }, s2 = function(t3, e4) {
                return (t3 != null ? t3.startContainer : void 0) === (e4 != null ? e4.startContainer : void 0) && (t3 != null ? t3.startOffset : void 0) === (e4 != null ? e4.startOffset : void 0) && (t3 != null ? t3.endContainer : void 0) === (e4 != null ? e4.endContainer : void 0) && (t3 != null ? t3.endOffset : void 0) === (e4 != null ? e4.endOffset : void 0);
              }, o3;
            }(e2.BasicObject), e2.selectionChangeObserver == null && (e2.selectionChangeObserver = new e2.SelectionChangeObserver());
          }.call(this), function() {
            var t2, n2, i2, o2, r2, s2, a2, u, c, l2, h2 = function(t3, e3) {
              return function() {
                return t3.apply(e3, arguments);
              };
            }, p = function(t3, e3) {
              function n3() {
                this.constructor = t3;
              }
              for (var i3 in e3)
                d.call(e3, i3) && (t3[i3] = e3[i3]);
              return n3.prototype = e3.prototype, t3.prototype = new n3(), t3.__super__ = e3.prototype, t3;
            }, d = {}.hasOwnProperty;
            i2 = e2.getDOMSelection, n2 = e2.getDOMRange, l2 = e2.setDOMRange, t2 = e2.elementContainsNode, s2 = e2.nodeIsCursorTarget, r2 = e2.innerElementIsActive, o2 = e2.handleEvent, a2 = e2.normalizeRange, u = e2.rangeIsCollapsed, c = e2.rangesAreEqual, e2.SelectionManager = function(d2) {
              function f(t3) {
                this.element = t3, this.selectionDidChange = h2(this.selectionDidChange, this), this.didMouseDown = h2(this.didMouseDown, this), this.locationMapper = new e2.LocationMapper(this.element), this.pointMapper = new e2.PointMapper(), this.lockCount = 0, o2("mousedown", { onElement: this.element, withCallback: this.didMouseDown });
              }
              return p(f, d2), f.prototype.getLocationRange = function(t3) {
                var e3, i3;
                return t3 == null && (t3 = {}), e3 = t3.strict === false ? this.createLocationRangeFromDOMRange(n2(), { strict: false }) : t3.ignoreLock ? this.currentLocationRange : (i3 = this.lockedLocationRange) != null ? i3 : this.currentLocationRange;
              }, f.prototype.setLocationRange = function(t3) {
                var e3;
                if (!this.lockedLocationRange)
                  return t3 = a2(t3), (e3 = this.createDOMRangeFromLocationRange(t3)) ? (l2(e3), this.updateCurrentLocationRange(t3)) : void 0;
              }, f.prototype.setLocationRangeFromPointRange = function(t3) {
                var e3, n3;
                return t3 = a2(t3), n3 = this.getLocationAtPoint(t3[0]), e3 = this.getLocationAtPoint(t3[1]), this.setLocationRange([n3, e3]);
              }, f.prototype.getClientRectAtLocationRange = function(t3) {
                var e3;
                return (e3 = this.createDOMRangeFromLocationRange(t3)) ? this.getClientRectsForDOMRange(e3)[1] : void 0;
              }, f.prototype.locationIsCursorTarget = function(t3) {
                var e3, n3, i3;
                return i3 = this.findNodeAndOffsetFromLocation(t3), e3 = i3[0], n3 = i3[1], s2(e3);
              }, f.prototype.lock = function() {
                return this.lockCount++ === 0 ? (this.updateCurrentLocationRange(), this.lockedLocationRange = this.getLocationRange()) : void 0;
              }, f.prototype.unlock = function() {
                var t3;
                return --this.lockCount === 0 && (t3 = this.lockedLocationRange, this.lockedLocationRange = null, t3 != null) ? this.setLocationRange(t3) : void 0;
              }, f.prototype.clearSelection = function() {
                var t3;
                return (t3 = i2()) != null ? t3.removeAllRanges() : void 0;
              }, f.prototype.selectionIsCollapsed = function() {
                var t3;
                return ((t3 = n2()) != null ? t3.collapsed : void 0) === true;
              }, f.prototype.selectionIsExpanded = function() {
                return !this.selectionIsCollapsed();
              }, f.prototype.createLocationRangeFromDOMRange = function(t3, e3) {
                var n3, i3;
                if (t3 != null && this.domRangeWithinElement(t3) && (i3 = this.findLocationFromContainerAndOffset(t3.startContainer, t3.startOffset, e3)))
                  return t3.collapsed || (n3 = this.findLocationFromContainerAndOffset(t3.endContainer, t3.endOffset, e3)), a2([i3, n3]);
              }, f.proxyMethod("locationMapper.findLocationFromContainerAndOffset"), f.proxyMethod("locationMapper.findContainerAndOffsetFromLocation"), f.proxyMethod("locationMapper.findNodeAndOffsetFromLocation"), f.proxyMethod("pointMapper.createDOMRangeFromPoint"), f.proxyMethod("pointMapper.getClientRectsForDOMRange"), f.prototype.didMouseDown = function() {
                return this.pauseTemporarily();
              }, f.prototype.pauseTemporarily = function() {
                var e3, n3, i3, r3;
                return this.paused = true, n3 = function(e4) {
                  return function() {
                    var n4, o3, s3;
                    for (e4.paused = false, clearTimeout(r3), o3 = 0, s3 = i3.length; s3 > o3; o3++)
                      n4 = i3[o3], n4.destroy();
                    return t2(document, e4.element) ? e4.selectionDidChange() : void 0;
                  };
                }(this), r3 = setTimeout(n3, 200), i3 = function() {
                  var t3, i4, r4, s3;
                  for (r4 = ["mousemove", "keydown"], s3 = [], t3 = 0, i4 = r4.length; i4 > t3; t3++)
                    e3 = r4[t3], s3.push(o2(e3, { onElement: document, withCallback: n3 }));
                  return s3;
                }();
              }, f.prototype.selectionDidChange = function() {
                return this.paused || r2(this.element) ? void 0 : this.updateCurrentLocationRange();
              }, f.prototype.updateCurrentLocationRange = function(t3) {
                var e3;
                return (t3 != null ? t3 : t3 = this.createLocationRangeFromDOMRange(n2())) && !c(t3, this.currentLocationRange) ? (this.currentLocationRange = t3, (e3 = this.delegate) != null && typeof e3.locationRangeDidChange == "function" ? e3.locationRangeDidChange(this.currentLocationRange.slice(0)) : void 0) : void 0;
              }, f.prototype.createDOMRangeFromLocationRange = function(t3) {
                var e3, n3, i3, o3;
                return i3 = this.findContainerAndOffsetFromLocation(t3[0]), n3 = u(t3) ? i3 : (o3 = this.findContainerAndOffsetFromLocation(t3[1])) != null ? o3 : i3, i3 != null && n3 != null ? (e3 = document.createRange(), e3.setStart.apply(e3, i3), e3.setEnd.apply(e3, n3), e3) : void 0;
              }, f.prototype.getLocationAtPoint = function(t3) {
                var e3, n3;
                return (e3 = this.createDOMRangeFromPoint(t3)) && (n3 = this.createLocationRangeFromDOMRange(e3)) != null ? n3[0] : void 0;
              }, f.prototype.domRangeWithinElement = function(e3) {
                return e3.collapsed ? t2(this.element, e3.startContainer) : t2(this.element, e3.startContainer) && t2(this.element, e3.endContainer);
              }, f;
            }(e2.BasicObject);
          }.call(this), function() {
            var t2, n2, i2, o2, r2 = function(t3, e3) {
              function n3() {
                this.constructor = t3;
              }
              for (var i3 in e3)
                s2.call(e3, i3) && (t3[i3] = e3[i3]);
              return n3.prototype = e3.prototype, t3.prototype = new n3(), t3.__super__ = e3.prototype, t3;
            }, s2 = {}.hasOwnProperty, a2 = [].slice;
            i2 = e2.rangeIsCollapsed, o2 = e2.rangesAreEqual, n2 = e2.objectsAreEqual, t2 = e2.getBlockConfig, e2.EditorController = function(s3) {
              function u(t3) {
                var n3, i3;
                this.editorElement = t3.editorElement, n3 = t3.document, i3 = t3.html, this.selectionManager = new e2.SelectionManager(this.editorElement), this.selectionManager.delegate = this, this.composition = new e2.Composition(), this.composition.delegate = this, this.attachmentManager = new e2.AttachmentManager(this.composition.getAttachments()), this.attachmentManager.delegate = this, this.inputController = new e2["Level" + e2.config.input.getLevel() + "InputController"](this.editorElement), this.inputController.delegate = this, this.inputController.responder = this.composition, this.compositionController = new e2.CompositionController(this.editorElement, this.composition), this.compositionController.delegate = this, this.toolbarController = new e2.ToolbarController(this.editorElement.toolbarElement), this.toolbarController.delegate = this, this.editor = new e2.Editor(this.composition, this.selectionManager, this.editorElement), n3 != null ? this.editor.loadDocument(n3) : this.editor.loadHTML(i3);
              }
              var c;
              return r2(u, s3), u.prototype.registerSelectionManager = function() {
                return e2.selectionChangeObserver.registerSelectionManager(this.selectionManager);
              }, u.prototype.unregisterSelectionManager = function() {
                return e2.selectionChangeObserver.unregisterSelectionManager(this.selectionManager);
              }, u.prototype.render = function() {
                return this.compositionController.render();
              }, u.prototype.reparse = function() {
                return this.composition.replaceHTML(this.editorElement.innerHTML);
              }, u.prototype.compositionDidChangeDocument = function() {
                return this.notifyEditorElement("document-change"), this.handlingInput ? void 0 : this.render();
              }, u.prototype.compositionDidChangeCurrentAttributes = function(t3) {
                return this.currentAttributes = t3, this.toolbarController.updateAttributes(this.currentAttributes), this.updateCurrentActions(), this.notifyEditorElement("attributes-change", { attributes: this.currentAttributes });
              }, u.prototype.compositionDidPerformInsertionAtRange = function(t3) {
                return this.pasting ? this.pastedRange = t3 : void 0;
              }, u.prototype.compositionShouldAcceptFile = function(t3) {
                return this.notifyEditorElement("file-accept", { file: t3 });
              }, u.prototype.compositionDidAddAttachment = function(t3) {
                var e3;
                return e3 = this.attachmentManager.manageAttachment(t3), this.notifyEditorElement("attachment-add", { attachment: e3 });
              }, u.prototype.compositionDidEditAttachment = function(t3) {
                var e3;
                return this.compositionController.rerenderViewForObject(t3), e3 = this.attachmentManager.manageAttachment(t3), this.notifyEditorElement("attachment-edit", { attachment: e3 }), this.notifyEditorElement("change");
              }, u.prototype.compositionDidChangeAttachmentPreviewURL = function(t3) {
                return this.compositionController.invalidateViewForObject(t3), this.notifyEditorElement("change");
              }, u.prototype.compositionDidRemoveAttachment = function(t3) {
                var e3;
                return e3 = this.attachmentManager.unmanageAttachment(t3), this.notifyEditorElement("attachment-remove", { attachment: e3 });
              }, u.prototype.compositionDidStartEditingAttachment = function(t3, e3) {
                return this.attachmentLocationRange = this.composition.document.getLocationRangeOfAttachment(t3), this.compositionController.installAttachmentEditorForAttachment(t3, e3), this.selectionManager.setLocationRange(this.attachmentLocationRange);
              }, u.prototype.compositionDidStopEditingAttachment = function() {
                return this.compositionController.uninstallAttachmentEditor(), this.attachmentLocationRange = null;
              }, u.prototype.compositionDidRequestChangingSelectionToLocationRange = function(t3) {
                return !this.loadingSnapshot || this.isFocused() ? (this.requestedLocationRange = t3, this.compositionRevisionWhenLocationRangeRequested = this.composition.revision, this.handlingInput ? void 0 : this.render()) : void 0;
              }, u.prototype.compositionWillLoadSnapshot = function() {
                return this.loadingSnapshot = true;
              }, u.prototype.compositionDidLoadSnapshot = function() {
                return this.compositionController.refreshViewCache(), this.render(), this.loadingSnapshot = false;
              }, u.prototype.getSelectionManager = function() {
                return this.selectionManager;
              }, u.proxyMethod("getSelectionManager().setLocationRange"), u.proxyMethod("getSelectionManager().getLocationRange"), u.prototype.attachmentManagerDidRequestRemovalOfAttachment = function(t3) {
                return this.removeAttachment(t3);
              }, u.prototype.compositionControllerWillSyncDocumentView = function() {
                return this.inputController.editorWillSyncDocumentView(), this.selectionManager.lock(), this.selectionManager.clearSelection();
              }, u.prototype.compositionControllerDidSyncDocumentView = function() {
                return this.inputController.editorDidSyncDocumentView(), this.selectionManager.unlock(), this.updateCurrentActions(), this.notifyEditorElement("sync");
              }, u.prototype.compositionControllerDidRender = function() {
                return this.requestedLocationRange != null && (this.compositionRevisionWhenLocationRangeRequested === this.composition.revision && this.selectionManager.setLocationRange(this.requestedLocationRange), this.requestedLocationRange = null, this.compositionRevisionWhenLocationRangeRequested = null), this.renderedCompositionRevision !== this.composition.revision && (this.runEditorFilters(), this.composition.updateCurrentAttributes(), this.notifyEditorElement("render")), this.renderedCompositionRevision = this.composition.revision;
              }, u.prototype.compositionControllerDidFocus = function() {
                return this.isFocusedInvisibly() && this.setLocationRange({ index: 0, offset: 0 }), this.toolbarController.hideDialog(), this.notifyEditorElement("focus");
              }, u.prototype.compositionControllerDidBlur = function() {
                return this.notifyEditorElement("blur");
              }, u.prototype.compositionControllerDidSelectAttachment = function(t3, e3) {
                return this.toolbarController.hideDialog(), this.composition.editAttachment(t3, e3);
              }, u.prototype.compositionControllerDidRequestDeselectingAttachment = function(t3) {
                var e3, n3;
                return e3 = (n3 = this.attachmentLocationRange) != null ? n3 : this.composition.document.getLocationRangeOfAttachment(t3), this.selectionManager.setLocationRange(e3[1]);
              }, u.prototype.compositionControllerWillUpdateAttachment = function(t3) {
                return this.editor.recordUndoEntry("Edit Attachment", { context: t3.id, consolidatable: true });
              }, u.prototype.compositionControllerDidRequestRemovalOfAttachment = function(t3) {
                return this.removeAttachment(t3);
              }, u.prototype.inputControllerWillHandleInput = function() {
                return this.handlingInput = true, this.requestedRender = false;
              }, u.prototype.inputControllerDidRequestRender = function() {
                return this.requestedRender = true;
              }, u.prototype.inputControllerDidHandleInput = function() {
                return this.handlingInput = false, this.requestedRender ? (this.requestedRender = false, this.render()) : void 0;
              }, u.prototype.inputControllerDidAllowUnhandledInput = function() {
                return this.notifyEditorElement("change");
              }, u.prototype.inputControllerDidRequestReparse = function() {
                return this.reparse();
              }, u.prototype.inputControllerWillPerformTyping = function() {
                return this.recordTypingUndoEntry();
              }, u.prototype.inputControllerWillPerformFormatting = function(t3) {
                return this.recordFormattingUndoEntry(t3);
              }, u.prototype.inputControllerWillCutText = function() {
                return this.editor.recordUndoEntry("Cut");
              }, u.prototype.inputControllerWillPaste = function(t3) {
                return this.editor.recordUndoEntry("Paste"), this.pasting = true, this.notifyEditorElement("before-paste", { paste: t3 });
              }, u.prototype.inputControllerDidPaste = function(t3) {
                return t3.range = this.pastedRange, this.pastedRange = null, this.pasting = null, this.notifyEditorElement("paste", { paste: t3 });
              }, u.prototype.inputControllerWillMoveText = function() {
                return this.editor.recordUndoEntry("Move");
              }, u.prototype.inputControllerWillAttachFiles = function() {
                return this.editor.recordUndoEntry("Drop Files");
              }, u.prototype.inputControllerWillPerformUndo = function() {
                return this.editor.undo();
              }, u.prototype.inputControllerWillPerformRedo = function() {
                return this.editor.redo();
              }, u.prototype.inputControllerDidReceiveKeyboardCommand = function(t3) {
                return this.toolbarController.applyKeyboardCommand(t3);
              }, u.prototype.inputControllerDidStartDrag = function() {
                return this.locationRangeBeforeDrag = this.selectionManager.getLocationRange();
              }, u.prototype.inputControllerDidReceiveDragOverPoint = function(t3) {
                return this.selectionManager.setLocationRangeFromPointRange(t3);
              }, u.prototype.inputControllerDidCancelDrag = function() {
                return this.selectionManager.setLocationRange(this.locationRangeBeforeDrag), this.locationRangeBeforeDrag = null;
              }, u.prototype.locationRangeDidChange = function(t3) {
                return this.composition.updateCurrentAttributes(), this.updateCurrentActions(), this.attachmentLocationRange && !o2(this.attachmentLocationRange, t3) && this.composition.stopEditingAttachment(), this.notifyEditorElement("selection-change");
              }, u.prototype.toolbarDidClickButton = function() {
                return this.getLocationRange() ? void 0 : this.setLocationRange({ index: 0, offset: 0 });
              }, u.prototype.toolbarDidInvokeAction = function(t3) {
                return this.invokeAction(t3);
              }, u.prototype.toolbarDidToggleAttribute = function(t3) {
                return this.recordFormattingUndoEntry(t3), this.composition.toggleCurrentAttribute(t3), this.render(), this.selectionFrozen ? void 0 : this.editorElement.focus();
              }, u.prototype.toolbarDidUpdateAttribute = function(t3, e3) {
                return this.recordFormattingUndoEntry(t3), this.composition.setCurrentAttribute(t3, e3), this.render(), this.selectionFrozen ? void 0 : this.editorElement.focus();
              }, u.prototype.toolbarDidRemoveAttribute = function(t3) {
                return this.recordFormattingUndoEntry(t3), this.composition.removeCurrentAttribute(t3), this.render(), this.selectionFrozen ? void 0 : this.editorElement.focus();
              }, u.prototype.toolbarWillShowDialog = function() {
                return this.composition.expandSelectionForEditing(), this.freezeSelection();
              }, u.prototype.toolbarDidShowDialog = function(t3) {
                return this.notifyEditorElement("toolbar-dialog-show", { dialogName: t3 });
              }, u.prototype.toolbarDidHideDialog = function(t3) {
                return this.thawSelection(), this.editorElement.focus(), this.notifyEditorElement("toolbar-dialog-hide", { dialogName: t3 });
              }, u.prototype.freezeSelection = function() {
                return this.selectionFrozen ? void 0 : (this.selectionManager.lock(), this.composition.freezeSelection(), this.selectionFrozen = true, this.render());
              }, u.prototype.thawSelection = function() {
                return this.selectionFrozen ? (this.composition.thawSelection(), this.selectionManager.unlock(), this.selectionFrozen = false, this.render()) : void 0;
              }, u.prototype.actions = { undo: { test: function() {
                return this.editor.canUndo();
              }, perform: function() {
                return this.editor.undo();
              } }, redo: { test: function() {
                return this.editor.canRedo();
              }, perform: function() {
                return this.editor.redo();
              } }, link: { test: function() {
                return this.editor.canActivateAttribute("href");
              } }, increaseNestingLevel: { test: function() {
                return this.editor.canIncreaseNestingLevel();
              }, perform: function() {
                return this.editor.increaseNestingLevel() && this.render();
              } }, decreaseNestingLevel: { test: function() {
                return this.editor.canDecreaseNestingLevel();
              }, perform: function() {
                return this.editor.decreaseNestingLevel() && this.render();
              } }, attachFiles: { test: function() {
                return true;
              }, perform: function() {
                return e2.config.input.pickFiles(this.editor.insertFiles);
              } } }, u.prototype.canInvokeAction = function(t3) {
                var e3, n3;
                return this.actionIsExternal(t3) ? true : !!((e3 = this.actions[t3]) != null && (n3 = e3.test) != null ? n3.call(this) : void 0);
              }, u.prototype.invokeAction = function(t3) {
                var e3, n3;
                return this.actionIsExternal(t3) ? this.notifyEditorElement("action-invoke", { actionName: t3 }) : (e3 = this.actions[t3]) != null && (n3 = e3.perform) != null ? n3.call(this) : void 0;
              }, u.prototype.actionIsExternal = function(t3) {
                return /^x-./.test(t3);
              }, u.prototype.getCurrentActions = function() {
                var t3, e3;
                e3 = {};
                for (t3 in this.actions)
                  e3[t3] = this.canInvokeAction(t3);
                return e3;
              }, u.prototype.updateCurrentActions = function() {
                var t3;
                return t3 = this.getCurrentActions(), n2(t3, this.currentActions) ? void 0 : (this.currentActions = t3, this.toolbarController.updateActions(this.currentActions), this.notifyEditorElement("actions-change", { actions: this.currentActions }));
              }, u.prototype.runEditorFilters = function() {
                var t3, e3, n3, i3, o3, r3, s4, a3;
                for (a3 = this.composition.getSnapshot(), o3 = this.editor.filters, n3 = 0, i3 = o3.length; i3 > n3; n3++)
                  e3 = o3[n3], t3 = a3.document, s4 = a3.selectedRange, a3 = (r3 = e3.call(this.editor, a3)) != null ? r3 : {}, a3.document == null && (a3.document = t3), a3.selectedRange == null && (a3.selectedRange = s4);
                return c(a3, this.composition.getSnapshot()) ? void 0 : this.composition.loadSnapshot(a3);
              }, c = function(t3, e3) {
                return o2(t3.selectedRange, e3.selectedRange) && t3.document.isEqualTo(e3.document);
              }, u.prototype.updateInputElement = function() {
                var t3, n3;
                return t3 = this.compositionController.getSerializableElement(), n3 = e2.serializeToContentType(t3, "text/html"), this.editorElement.setInputElementValue(n3);
              }, u.prototype.notifyEditorElement = function(t3, e3) {
                switch (t3) {
                  case "document-change":
                    this.documentChangedSinceLastRender = true;
                    break;
                  case "render":
                    this.documentChangedSinceLastRender && (this.documentChangedSinceLastRender = false, this.notifyEditorElement("change"));
                    break;
                  case "change":
                  case "attachment-add":
                  case "attachment-edit":
                  case "attachment-remove":
                    this.updateInputElement();
                }
                return this.editorElement.notify(t3, e3);
              }, u.prototype.removeAttachment = function(t3) {
                return this.editor.recordUndoEntry("Delete Attachment"), this.composition.removeAttachment(t3), this.render();
              }, u.prototype.recordFormattingUndoEntry = function(e3) {
                var n3, o3;
                return n3 = t2(e3), o3 = this.selectionManager.getLocationRange(), n3 || !i2(o3) ? this.editor.recordUndoEntry("Formatting", { context: this.getUndoContext(), consolidatable: true }) : void 0;
              }, u.prototype.recordTypingUndoEntry = function() {
                return this.editor.recordUndoEntry("Typing", { context: this.getUndoContext(this.currentAttributes), consolidatable: true });
              }, u.prototype.getUndoContext = function() {
                var t3;
                return t3 = 1 <= arguments.length ? a2.call(arguments, 0) : [], [this.getLocationContext(), this.getTimeContext()].concat(a2.call(t3));
              }, u.prototype.getLocationContext = function() {
                var t3;
                return t3 = this.selectionManager.getLocationRange(), i2(t3) ? t3[0].index : t3;
              }, u.prototype.getTimeContext = function() {
                return e2.config.undoInterval > 0 ? Math.floor(new Date().getTime() / e2.config.undoInterval) : 0;
              }, u.prototype.isFocused = function() {
                var t3;
                return this.editorElement === ((t3 = this.editorElement.ownerDocument) != null ? t3.activeElement : void 0);
              }, u.prototype.isFocusedInvisibly = function() {
                return this.isFocused() && !this.getLocationRange();
              }, u;
            }(e2.Controller);
          }.call(this), function() {
            var t2, n2, i2, o2, r2, s2, a2, u = [].indexOf || function(t3) {
              for (var e3 = 0, n3 = this.length; n3 > e3; e3++)
                if (e3 in this && this[e3] === t3)
                  return e3;
              return -1;
            };
            n2 = e2.browser, s2 = e2.makeElement, a2 = e2.triggerEvent, o2 = e2.handleEvent, r2 = e2.handleEventOnce, i2 = e2.findClosestElementFromNode, t2 = e2.AttachmentView.attachmentSelector, e2.registerElement("trix-editor", function() {
              var c, l2, h2, p, d, f, g, m, v;
              return g = 0, l2 = function(t3) {
                return !document.querySelector(":focus") && t3.hasAttribute("autofocus") && document.querySelector("[autofocus]") === t3 ? t3.focus() : void 0;
              }, m = function(t3) {
                return t3.hasAttribute("contenteditable") ? void 0 : (t3.setAttribute("contenteditable", ""), r2("focus", { onElement: t3, withCallback: function() {
                  return h2(t3);
                } }));
              }, h2 = function(t3) {
                return d(t3), v(t3);
              }, d = function(t3) {
                return (typeof document.queryCommandSupported == "function" ? document.queryCommandSupported("enableObjectResizing") : void 0) ? (document.execCommand("enableObjectResizing", false, false), o2("mscontrolselect", { onElement: t3, preventDefault: true })) : void 0;
              }, v = function() {
                var t3;
                return (typeof document.queryCommandSupported == "function" ? document.queryCommandSupported("DefaultParagraphSeparator") : void 0) && (t3 = e2.config.blockAttributes["default"].tagName, t3 === "div" || t3 === "p") ? document.execCommand("DefaultParagraphSeparator", false, t3) : void 0;
              }, c = function(t3) {
                return t3.hasAttribute("role") ? void 0 : t3.setAttribute("role", "textbox");
              }, f = function(t3) {
                var e3;
                if (!t3.hasAttribute("aria-label") && !t3.hasAttribute("aria-labelledby"))
                  return (e3 = function() {
                    var e4, n3, i3;
                    return i3 = function() {
                      var n4, i4, o3, r3;
                      for (o3 = t3.labels, r3 = [], n4 = 0, i4 = o3.length; i4 > n4; n4++)
                        e4 = o3[n4], e4.contains(t3) || r3.push(e4.textContent);
                      return r3;
                    }(), (n3 = i3.join(" ")) ? t3.setAttribute("aria-label", n3) : t3.removeAttribute("aria-label");
                  })(), o2("focus", { onElement: t3, withCallback: e3 });
              }, p = function() {
                return n2.forcesObjectResizing ? { display: "inline", width: "auto" } : { display: "inline-block", width: "1px" };
              }(), { defaultCSS: "%t {\n  display: block;\n}\n\n%t:empty:not(:focus)::before {\n  content: attr(placeholder);\n  color: graytext;\n  cursor: text;\n  pointer-events: none;\n}\n\n%t a[contenteditable=false] {\n  cursor: text;\n}\n\n%t img {\n  max-width: 100%;\n  height: auto;\n}\n\n%t " + t2 + " figcaption textarea {\n  resize: none;\n}\n\n%t " + t2 + " figcaption textarea.trix-autoresize-clone {\n  position: absolute;\n  left: -9999px;\n  max-height: 0px;\n}\n\n%t " + t2 + " figcaption[data-trix-placeholder]:empty::before {\n  content: attr(data-trix-placeholder);\n  color: graytext;\n}\n\n%t [data-trix-cursor-target] {\n  display: " + p.display + " !important;\n  width: " + p.width + " !important;\n  padding: 0 !important;\n  margin: 0 !important;\n  border: none !important;\n}\n\n%t [data-trix-cursor-target=left] {\n  vertical-align: top !important;\n  margin-left: -1px !important;\n}\n\n%t [data-trix-cursor-target=right] {\n  vertical-align: bottom !important;\n  margin-right: -1px !important;\n}", trixId: { get: function() {
                return this.hasAttribute("trix-id") ? this.getAttribute("trix-id") : (this.setAttribute("trix-id", ++g), this.trixId);
              } }, labels: { get: function() {
                var t3, e3, n3;
                return e3 = [], this.id && this.ownerDocument && e3.push.apply(e3, this.ownerDocument.querySelectorAll("label[for='" + this.id + "']")), (t3 = i2(this, { matchingSelector: "label" })) && ((n3 = t3.control) === this || n3 === null) && e3.push(t3), e3;
              } }, toolbarElement: { get: function() {
                var t3, e3, n3;
                return this.hasAttribute("toolbar") ? (e3 = this.ownerDocument) != null ? e3.getElementById(this.getAttribute("toolbar")) : void 0 : this.parentNode ? (n3 = "trix-toolbar-" + this.trixId, this.setAttribute("toolbar", n3), t3 = s2("trix-toolbar", { id: n3 }), this.parentNode.insertBefore(t3, this), t3) : void 0;
              } }, inputElement: { get: function() {
                var t3, e3, n3;
                return this.hasAttribute("input") ? (n3 = this.ownerDocument) != null ? n3.getElementById(this.getAttribute("input")) : void 0 : this.parentNode ? (e3 = "trix-input-" + this.trixId, this.setAttribute("input", e3), t3 = s2("input", { type: "hidden", id: e3 }), this.parentNode.insertBefore(t3, this.nextElementSibling), t3) : void 0;
              } }, editor: { get: function() {
                var t3;
                return (t3 = this.editorController) != null ? t3.editor : void 0;
              } }, name: { get: function() {
                var t3;
                return (t3 = this.inputElement) != null ? t3.name : void 0;
              } }, value: { get: function() {
                var t3;
                return (t3 = this.inputElement) != null ? t3.value : void 0;
              }, set: function(t3) {
                var e3;
                return this.defaultValue = t3, (e3 = this.editor) != null ? e3.loadHTML(this.defaultValue) : void 0;
              } }, notify: function(t3, e3) {
                return this.editorController ? a2("trix-" + t3, { onElement: this, attributes: e3 }) : void 0;
              }, setInputElementValue: function(t3) {
                var e3;
                return (e3 = this.inputElement) != null ? e3.value = t3 : void 0;
              }, initialize: function() {
                return this.hasAttribute("data-trix-internal") ? void 0 : (m(this), c(this), f(this));
              }, connect: function() {
                return this.hasAttribute("data-trix-internal") ? void 0 : (this.editorController || (a2("trix-before-initialize", { onElement: this }), this.editorController = new e2.EditorController({ editorElement: this, html: this.defaultValue = this.value }), requestAnimationFrame(function(t3) {
                  return function() {
                    return a2("trix-initialize", { onElement: t3 });
                  };
                }(this))), this.editorController.registerSelectionManager(), this.registerResetListener(), this.registerClickListener(), l2(this));
              }, disconnect: function() {
                var t3;
                return (t3 = this.editorController) != null && t3.unregisterSelectionManager(), this.unregisterResetListener(), this.unregisterClickListener();
              }, registerResetListener: function() {
                return this.resetListener = this.resetBubbled.bind(this), window.addEventListener("reset", this.resetListener, false);
              }, unregisterResetListener: function() {
                return window.removeEventListener("reset", this.resetListener, false);
              }, registerClickListener: function() {
                return this.clickListener = this.clickBubbled.bind(this), window.addEventListener("click", this.clickListener, false);
              }, unregisterClickListener: function() {
                return window.removeEventListener("click", this.clickListener, false);
              }, resetBubbled: function(t3) {
                var e3;
                if (!t3.defaultPrevented && t3.target === ((e3 = this.inputElement) != null ? e3.form : void 0))
                  return this.reset();
              }, clickBubbled: function(t3) {
                var e3;
                if (!(t3.defaultPrevented || this.contains(t3.target) || !(e3 = i2(t3.target, { matchingSelector: "label" })) || u.call(this.labels, e3) < 0))
                  return this.focus();
              }, reset: function() {
                return this.value = this.defaultValue;
              } };
            }());
          }.call(this), function() {
          }.call(this);
        }).call(this), typeof module == "object" && module.exports ? module.exports = e2 : typeof define == "function" && define.amd && define(e2);
      }.call(exports);
    }
  });

  // node_modules/@hotwired/turbo/dist/turbo.es2017-esm.js
  var turbo_es2017_esm_exports = {};
  __export(turbo_es2017_esm_exports, {
    PageRenderer: () => PageRenderer,
    PageSnapshot: () => PageSnapshot,
    clearCache: () => clearCache,
    connectStreamSource: () => connectStreamSource,
    disconnectStreamSource: () => disconnectStreamSource,
    navigator: () => navigator$1,
    registerAdapter: () => registerAdapter,
    renderStreamMessage: () => renderStreamMessage,
    session: () => session,
    setProgressBarDelay: () => setProgressBarDelay,
    start: () => start,
    visit: () => visit
  });
  (function() {
    if (window.Reflect === void 0 || window.customElements === void 0 || window.customElements.polyfillWrapFlushCallback) {
      return;
    }
    const BuiltInHTMLElement = HTMLElement;
    const wrapperForTheName = {
      "HTMLElement": function HTMLElement2() {
        return Reflect.construct(BuiltInHTMLElement, [], this.constructor);
      }
    };
    window.HTMLElement = wrapperForTheName["HTMLElement"];
    HTMLElement.prototype = BuiltInHTMLElement.prototype;
    HTMLElement.prototype.constructor = HTMLElement;
    Object.setPrototypeOf(HTMLElement, BuiltInHTMLElement);
  })();
  var submittersByForm = new WeakMap();
  function findSubmitterFromClickTarget(target) {
    const element = target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
    const candidate = element ? element.closest("input, button") : null;
    return (candidate === null || candidate === void 0 ? void 0 : candidate.type) == "submit" ? candidate : null;
  }
  function clickCaptured(event) {
    const submitter = findSubmitterFromClickTarget(event.target);
    if (submitter && submitter.form) {
      submittersByForm.set(submitter.form, submitter);
    }
  }
  (function() {
    if ("submitter" in Event.prototype)
      return;
    let prototype;
    if ("SubmitEvent" in window && /Apple Computer/.test(navigator.vendor)) {
      prototype = window.SubmitEvent.prototype;
    } else if ("SubmitEvent" in window) {
      return;
    } else {
      prototype = window.Event.prototype;
    }
    addEventListener("click", clickCaptured, true);
    Object.defineProperty(prototype, "submitter", {
      get() {
        if (this.type == "submit" && this.target instanceof HTMLFormElement) {
          return submittersByForm.get(this.target);
        }
      }
    });
  })();
  var FrameLoadingStyle;
  (function(FrameLoadingStyle2) {
    FrameLoadingStyle2["eager"] = "eager";
    FrameLoadingStyle2["lazy"] = "lazy";
  })(FrameLoadingStyle || (FrameLoadingStyle = {}));
  var FrameElement = class extends HTMLElement {
    constructor() {
      super();
      this.loaded = Promise.resolve();
      this.delegate = new FrameElement.delegateConstructor(this);
    }
    static get observedAttributes() {
      return ["disabled", "loading", "src"];
    }
    connectedCallback() {
      this.delegate.connect();
    }
    disconnectedCallback() {
      this.delegate.disconnect();
    }
    reload() {
      const { src } = this;
      this.src = null;
      this.src = src;
    }
    attributeChangedCallback(name) {
      if (name == "loading") {
        this.delegate.loadingStyleChanged();
      } else if (name == "src") {
        this.delegate.sourceURLChanged();
      } else {
        this.delegate.disabledChanged();
      }
    }
    get src() {
      return this.getAttribute("src");
    }
    set src(value) {
      if (value) {
        this.setAttribute("src", value);
      } else {
        this.removeAttribute("src");
      }
    }
    get loading() {
      return frameLoadingStyleFromString(this.getAttribute("loading") || "");
    }
    set loading(value) {
      if (value) {
        this.setAttribute("loading", value);
      } else {
        this.removeAttribute("loading");
      }
    }
    get disabled() {
      return this.hasAttribute("disabled");
    }
    set disabled(value) {
      if (value) {
        this.setAttribute("disabled", "");
      } else {
        this.removeAttribute("disabled");
      }
    }
    get autoscroll() {
      return this.hasAttribute("autoscroll");
    }
    set autoscroll(value) {
      if (value) {
        this.setAttribute("autoscroll", "");
      } else {
        this.removeAttribute("autoscroll");
      }
    }
    get complete() {
      return !this.delegate.isLoading;
    }
    get isActive() {
      return this.ownerDocument === document && !this.isPreview;
    }
    get isPreview() {
      var _a, _b;
      return (_b = (_a = this.ownerDocument) === null || _a === void 0 ? void 0 : _a.documentElement) === null || _b === void 0 ? void 0 : _b.hasAttribute("data-turbo-preview");
    }
  };
  function frameLoadingStyleFromString(style) {
    switch (style.toLowerCase()) {
      case "lazy":
        return FrameLoadingStyle.lazy;
      default:
        return FrameLoadingStyle.eager;
    }
  }
  function expandURL(locatable) {
    return new URL(locatable.toString(), document.baseURI);
  }
  function getAnchor(url2) {
    let anchorMatch;
    if (url2.hash) {
      return url2.hash.slice(1);
    } else if (anchorMatch = url2.href.match(/#(.*)$/)) {
      return anchorMatch[1];
    }
  }
  function getExtension(url2) {
    return (getLastPathComponent(url2).match(/\.[^.]*$/) || [])[0] || "";
  }
  function isHTML(url2) {
    return !!getExtension(url2).match(/^(?:|\.(?:htm|html|xhtml))$/);
  }
  function isPrefixedBy(baseURL, url2) {
    const prefix = getPrefix(url2);
    return baseURL.href === expandURL(prefix).href || baseURL.href.startsWith(prefix);
  }
  function getRequestURL(url2) {
    const anchor = getAnchor(url2);
    return anchor != null ? url2.href.slice(0, -(anchor.length + 1)) : url2.href;
  }
  function toCacheKey(url2) {
    return getRequestURL(url2);
  }
  function urlsAreEqual(left, right) {
    return expandURL(left).href == expandURL(right).href;
  }
  function getPathComponents(url2) {
    return url2.pathname.split("/").slice(1);
  }
  function getLastPathComponent(url2) {
    return getPathComponents(url2).slice(-1)[0];
  }
  function getPrefix(url2) {
    return addTrailingSlash(url2.origin + url2.pathname);
  }
  function addTrailingSlash(value) {
    return value.endsWith("/") ? value : value + "/";
  }
  var FetchResponse = class {
    constructor(response) {
      this.response = response;
    }
    get succeeded() {
      return this.response.ok;
    }
    get failed() {
      return !this.succeeded;
    }
    get clientError() {
      return this.statusCode >= 400 && this.statusCode <= 499;
    }
    get serverError() {
      return this.statusCode >= 500 && this.statusCode <= 599;
    }
    get redirected() {
      return this.response.redirected;
    }
    get location() {
      return expandURL(this.response.url);
    }
    get isHTML() {
      return this.contentType && this.contentType.match(/^(?:text\/([^\s;,]+\b)?html|application\/xhtml\+xml)\b/);
    }
    get statusCode() {
      return this.response.status;
    }
    get contentType() {
      return this.header("Content-Type");
    }
    get responseText() {
      return this.response.clone().text();
    }
    get responseHTML() {
      if (this.isHTML) {
        return this.response.clone().text();
      } else {
        return Promise.resolve(void 0);
      }
    }
    header(name) {
      return this.response.headers.get(name);
    }
  };
  function dispatch(eventName, { target, cancelable, detail } = {}) {
    const event = new CustomEvent(eventName, { cancelable, bubbles: true, detail });
    if (target && target.isConnected) {
      target.dispatchEvent(event);
    } else {
      document.documentElement.dispatchEvent(event);
    }
    return event;
  }
  function nextAnimationFrame() {
    return new Promise((resolve) => requestAnimationFrame(() => resolve()));
  }
  function nextEventLoopTick() {
    return new Promise((resolve) => setTimeout(() => resolve(), 0));
  }
  function nextMicrotask() {
    return Promise.resolve();
  }
  function parseHTMLDocument(html = "") {
    return new DOMParser().parseFromString(html, "text/html");
  }
  function unindent(strings, ...values) {
    const lines = interpolate(strings, values).replace(/^\n/, "").split("\n");
    const match = lines[0].match(/^\s+/);
    const indent = match ? match[0].length : 0;
    return lines.map((line) => line.slice(indent)).join("\n");
  }
  function interpolate(strings, values) {
    return strings.reduce((result, string, i2) => {
      const value = values[i2] == void 0 ? "" : values[i2];
      return result + string + value;
    }, "");
  }
  function uuid() {
    return Array.apply(null, { length: 36 }).map((_, i2) => {
      if (i2 == 8 || i2 == 13 || i2 == 18 || i2 == 23) {
        return "-";
      } else if (i2 == 14) {
        return "4";
      } else if (i2 == 19) {
        return (Math.floor(Math.random() * 4) + 8).toString(16);
      } else {
        return Math.floor(Math.random() * 15).toString(16);
      }
    }).join("");
  }
  var FetchMethod;
  (function(FetchMethod2) {
    FetchMethod2[FetchMethod2["get"] = 0] = "get";
    FetchMethod2[FetchMethod2["post"] = 1] = "post";
    FetchMethod2[FetchMethod2["put"] = 2] = "put";
    FetchMethod2[FetchMethod2["patch"] = 3] = "patch";
    FetchMethod2[FetchMethod2["delete"] = 4] = "delete";
  })(FetchMethod || (FetchMethod = {}));
  function fetchMethodFromString(method) {
    switch (method.toLowerCase()) {
      case "get":
        return FetchMethod.get;
      case "post":
        return FetchMethod.post;
      case "put":
        return FetchMethod.put;
      case "patch":
        return FetchMethod.patch;
      case "delete":
        return FetchMethod.delete;
    }
  }
  var FetchRequest = class {
    constructor(delegate, method, location2, body = new URLSearchParams(), target = null) {
      this.abortController = new AbortController();
      this.resolveRequestPromise = (value) => {
      };
      this.delegate = delegate;
      this.method = method;
      this.headers = this.defaultHeaders;
      if (this.isIdempotent) {
        this.url = mergeFormDataEntries(location2, [...body.entries()]);
      } else {
        this.body = body;
        this.url = location2;
      }
      this.target = target;
    }
    get location() {
      return this.url;
    }
    get params() {
      return this.url.searchParams;
    }
    get entries() {
      return this.body ? Array.from(this.body.entries()) : [];
    }
    cancel() {
      this.abortController.abort();
    }
    async perform() {
      var _a, _b;
      const { fetchOptions } = this;
      (_b = (_a = this.delegate).prepareHeadersForRequest) === null || _b === void 0 ? void 0 : _b.call(_a, this.headers, this);
      await this.allowRequestToBeIntercepted(fetchOptions);
      try {
        this.delegate.requestStarted(this);
        const response = await fetch(this.url.href, fetchOptions);
        return await this.receive(response);
      } catch (error4) {
        if (error4.name !== "AbortError") {
          this.delegate.requestErrored(this, error4);
          throw error4;
        }
      } finally {
        this.delegate.requestFinished(this);
      }
    }
    async receive(response) {
      const fetchResponse = new FetchResponse(response);
      const event = dispatch("turbo:before-fetch-response", { cancelable: true, detail: { fetchResponse }, target: this.target });
      if (event.defaultPrevented) {
        this.delegate.requestPreventedHandlingResponse(this, fetchResponse);
      } else if (fetchResponse.succeeded) {
        this.delegate.requestSucceededWithResponse(this, fetchResponse);
      } else {
        this.delegate.requestFailedWithResponse(this, fetchResponse);
      }
      return fetchResponse;
    }
    get fetchOptions() {
      var _a;
      return {
        method: FetchMethod[this.method].toUpperCase(),
        credentials: "same-origin",
        headers: this.headers,
        redirect: "follow",
        body: this.body,
        signal: this.abortSignal,
        referrer: (_a = this.delegate.referrer) === null || _a === void 0 ? void 0 : _a.href
      };
    }
    get defaultHeaders() {
      return {
        "Accept": "text/html, application/xhtml+xml"
      };
    }
    get isIdempotent() {
      return this.method == FetchMethod.get;
    }
    get abortSignal() {
      return this.abortController.signal;
    }
    async allowRequestToBeIntercepted(fetchOptions) {
      const requestInterception = new Promise((resolve) => this.resolveRequestPromise = resolve);
      const event = dispatch("turbo:before-fetch-request", {
        cancelable: true,
        detail: {
          fetchOptions,
          url: this.url.href,
          resume: this.resolveRequestPromise
        },
        target: this.target
      });
      if (event.defaultPrevented)
        await requestInterception;
    }
  };
  function mergeFormDataEntries(url2, entries) {
    const currentSearchParams = new URLSearchParams(url2.search);
    for (const [name, value] of entries) {
      if (value instanceof File)
        continue;
      if (currentSearchParams.has(name)) {
        currentSearchParams.delete(name);
        url2.searchParams.set(name, value);
      } else {
        url2.searchParams.append(name, value);
      }
    }
    return url2;
  }
  var AppearanceObserver = class {
    constructor(delegate, element) {
      this.started = false;
      this.intersect = (entries) => {
        const lastEntry = entries.slice(-1)[0];
        if (lastEntry === null || lastEntry === void 0 ? void 0 : lastEntry.isIntersecting) {
          this.delegate.elementAppearedInViewport(this.element);
        }
      };
      this.delegate = delegate;
      this.element = element;
      this.intersectionObserver = new IntersectionObserver(this.intersect);
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.intersectionObserver.observe(this.element);
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        this.intersectionObserver.unobserve(this.element);
      }
    }
  };
  var StreamMessage = class {
    constructor(html) {
      this.templateElement = document.createElement("template");
      this.templateElement.innerHTML = html;
    }
    static wrap(message) {
      if (typeof message == "string") {
        return new this(message);
      } else {
        return message;
      }
    }
    get fragment() {
      const fragment = document.createDocumentFragment();
      for (const element of this.foreignElements) {
        fragment.appendChild(document.importNode(element, true));
      }
      return fragment;
    }
    get foreignElements() {
      return this.templateChildren.reduce((streamElements, child) => {
        if (child.tagName.toLowerCase() == "turbo-stream") {
          return [...streamElements, child];
        } else {
          return streamElements;
        }
      }, []);
    }
    get templateChildren() {
      return Array.from(this.templateElement.content.children);
    }
  };
  StreamMessage.contentType = "text/vnd.turbo-stream.html";
  var FormSubmissionState;
  (function(FormSubmissionState2) {
    FormSubmissionState2[FormSubmissionState2["initialized"] = 0] = "initialized";
    FormSubmissionState2[FormSubmissionState2["requesting"] = 1] = "requesting";
    FormSubmissionState2[FormSubmissionState2["waiting"] = 2] = "waiting";
    FormSubmissionState2[FormSubmissionState2["receiving"] = 3] = "receiving";
    FormSubmissionState2[FormSubmissionState2["stopping"] = 4] = "stopping";
    FormSubmissionState2[FormSubmissionState2["stopped"] = 5] = "stopped";
  })(FormSubmissionState || (FormSubmissionState = {}));
  var FormEnctype;
  (function(FormEnctype2) {
    FormEnctype2["urlEncoded"] = "application/x-www-form-urlencoded";
    FormEnctype2["multipart"] = "multipart/form-data";
    FormEnctype2["plain"] = "text/plain";
  })(FormEnctype || (FormEnctype = {}));
  function formEnctypeFromString(encoding) {
    switch (encoding.toLowerCase()) {
      case FormEnctype.multipart:
        return FormEnctype.multipart;
      case FormEnctype.plain:
        return FormEnctype.plain;
      default:
        return FormEnctype.urlEncoded;
    }
  }
  var FormSubmission = class {
    constructor(delegate, formElement, submitter, mustRedirect = false) {
      this.state = FormSubmissionState.initialized;
      this.delegate = delegate;
      this.formElement = formElement;
      this.submitter = submitter;
      this.formData = buildFormData(formElement, submitter);
      this.fetchRequest = new FetchRequest(this, this.method, this.location, this.body, this.formElement);
      this.mustRedirect = mustRedirect;
    }
    get method() {
      var _a;
      const method = ((_a = this.submitter) === null || _a === void 0 ? void 0 : _a.getAttribute("formmethod")) || this.formElement.getAttribute("method") || "";
      return fetchMethodFromString(method.toLowerCase()) || FetchMethod.get;
    }
    get action() {
      var _a;
      const formElementAction = typeof this.formElement.action === "string" ? this.formElement.action : null;
      return ((_a = this.submitter) === null || _a === void 0 ? void 0 : _a.getAttribute("formaction")) || this.formElement.getAttribute("action") || formElementAction || "";
    }
    get location() {
      return expandURL(this.action);
    }
    get body() {
      if (this.enctype == FormEnctype.urlEncoded || this.method == FetchMethod.get) {
        return new URLSearchParams(this.stringFormData);
      } else {
        return this.formData;
      }
    }
    get enctype() {
      var _a;
      return formEnctypeFromString(((_a = this.submitter) === null || _a === void 0 ? void 0 : _a.getAttribute("formenctype")) || this.formElement.enctype);
    }
    get isIdempotent() {
      return this.fetchRequest.isIdempotent;
    }
    get stringFormData() {
      return [...this.formData].reduce((entries, [name, value]) => {
        return entries.concat(typeof value == "string" ? [[name, value]] : []);
      }, []);
    }
    async start() {
      const { initialized, requesting } = FormSubmissionState;
      if (this.state == initialized) {
        this.state = requesting;
        return this.fetchRequest.perform();
      }
    }
    stop() {
      const { stopping, stopped } = FormSubmissionState;
      if (this.state != stopping && this.state != stopped) {
        this.state = stopping;
        this.fetchRequest.cancel();
        return true;
      }
    }
    prepareHeadersForRequest(headers, request2) {
      if (!request2.isIdempotent) {
        const token = getCookieValue(getMetaContent("csrf-param")) || getMetaContent("csrf-token");
        if (token) {
          headers["X-CSRF-Token"] = token;
        }
        headers["Accept"] = [StreamMessage.contentType, headers["Accept"]].join(", ");
      }
    }
    requestStarted(request2) {
      this.state = FormSubmissionState.waiting;
      dispatch("turbo:submit-start", { target: this.formElement, detail: { formSubmission: this } });
      this.delegate.formSubmissionStarted(this);
    }
    requestPreventedHandlingResponse(request2, response) {
      this.result = { success: response.succeeded, fetchResponse: response };
    }
    requestSucceededWithResponse(request2, response) {
      if (response.clientError || response.serverError) {
        this.delegate.formSubmissionFailedWithResponse(this, response);
      } else if (this.requestMustRedirect(request2) && responseSucceededWithoutRedirect(response)) {
        const error4 = new Error("Form responses must redirect to another location");
        this.delegate.formSubmissionErrored(this, error4);
      } else {
        this.state = FormSubmissionState.receiving;
        this.result = { success: true, fetchResponse: response };
        this.delegate.formSubmissionSucceededWithResponse(this, response);
      }
    }
    requestFailedWithResponse(request2, response) {
      this.result = { success: false, fetchResponse: response };
      this.delegate.formSubmissionFailedWithResponse(this, response);
    }
    requestErrored(request2, error4) {
      this.result = { success: false, error: error4 };
      this.delegate.formSubmissionErrored(this, error4);
    }
    requestFinished(request2) {
      this.state = FormSubmissionState.stopped;
      dispatch("turbo:submit-end", { target: this.formElement, detail: Object.assign({ formSubmission: this }, this.result) });
      this.delegate.formSubmissionFinished(this);
    }
    requestMustRedirect(request2) {
      return !request2.isIdempotent && this.mustRedirect;
    }
  };
  function buildFormData(formElement, submitter) {
    const formData = new FormData(formElement);
    const name = submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("name");
    const value = submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("value");
    if (name && value != null && formData.get(name) != value) {
      formData.append(name, value);
    }
    return formData;
  }
  function getCookieValue(cookieName) {
    if (cookieName != null) {
      const cookies = document.cookie ? document.cookie.split("; ") : [];
      const cookie = cookies.find((cookie2) => cookie2.startsWith(cookieName));
      if (cookie) {
        const value = cookie.split("=").slice(1).join("=");
        return value ? decodeURIComponent(value) : void 0;
      }
    }
  }
  function getMetaContent(name) {
    const element = document.querySelector(`meta[name="${name}"]`);
    return element && element.content;
  }
  function responseSucceededWithoutRedirect(response) {
    return response.statusCode == 200 && !response.redirected;
  }
  var Snapshot = class {
    constructor(element) {
      this.element = element;
    }
    get children() {
      return [...this.element.children];
    }
    hasAnchor(anchor) {
      return this.getElementForAnchor(anchor) != null;
    }
    getElementForAnchor(anchor) {
      return anchor ? this.element.querySelector(`[id='${anchor}'], a[name='${anchor}']`) : null;
    }
    get isConnected() {
      return this.element.isConnected;
    }
    get firstAutofocusableElement() {
      return this.element.querySelector("[autofocus]");
    }
    get permanentElements() {
      return [...this.element.querySelectorAll("[id][data-turbo-permanent]")];
    }
    getPermanentElementById(id) {
      return this.element.querySelector(`#${id}[data-turbo-permanent]`);
    }
    getPermanentElementMapForSnapshot(snapshot) {
      const permanentElementMap = {};
      for (const currentPermanentElement of this.permanentElements) {
        const { id } = currentPermanentElement;
        const newPermanentElement = snapshot.getPermanentElementById(id);
        if (newPermanentElement) {
          permanentElementMap[id] = [currentPermanentElement, newPermanentElement];
        }
      }
      return permanentElementMap;
    }
  };
  var FormInterceptor = class {
    constructor(delegate, element) {
      this.submitBubbled = (event) => {
        const form = event.target;
        if (form instanceof HTMLFormElement && form.closest("turbo-frame, html") == this.element) {
          const submitter = event.submitter || void 0;
          if (this.delegate.shouldInterceptFormSubmission(form, submitter)) {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.delegate.formSubmissionIntercepted(form, submitter);
          }
        }
      };
      this.delegate = delegate;
      this.element = element;
    }
    start() {
      this.element.addEventListener("submit", this.submitBubbled);
    }
    stop() {
      this.element.removeEventListener("submit", this.submitBubbled);
    }
  };
  var View = class {
    constructor(delegate, element) {
      this.resolveRenderPromise = (value) => {
      };
      this.resolveInterceptionPromise = (value) => {
      };
      this.delegate = delegate;
      this.element = element;
    }
    scrollToAnchor(anchor) {
      const element = this.snapshot.getElementForAnchor(anchor);
      if (element) {
        this.scrollToElement(element);
        this.focusElement(element);
      } else {
        this.scrollToPosition({ x: 0, y: 0 });
      }
    }
    scrollToAnchorFromLocation(location2) {
      this.scrollToAnchor(getAnchor(location2));
    }
    scrollToElement(element) {
      element.scrollIntoView();
    }
    focusElement(element) {
      if (element instanceof HTMLElement) {
        if (element.hasAttribute("tabindex")) {
          element.focus();
        } else {
          element.setAttribute("tabindex", "-1");
          element.focus();
          element.removeAttribute("tabindex");
        }
      }
    }
    scrollToPosition({ x, y }) {
      this.scrollRoot.scrollTo(x, y);
    }
    scrollToTop() {
      this.scrollToPosition({ x: 0, y: 0 });
    }
    get scrollRoot() {
      return window;
    }
    async render(renderer) {
      const { isPreview, shouldRender, newSnapshot: snapshot } = renderer;
      if (shouldRender) {
        try {
          this.renderPromise = new Promise((resolve) => this.resolveRenderPromise = resolve);
          this.renderer = renderer;
          this.prepareToRenderSnapshot(renderer);
          const renderInterception = new Promise((resolve) => this.resolveInterceptionPromise = resolve);
          const immediateRender = this.delegate.allowsImmediateRender(snapshot, this.resolveInterceptionPromise);
          if (!immediateRender)
            await renderInterception;
          await this.renderSnapshot(renderer);
          this.delegate.viewRenderedSnapshot(snapshot, isPreview);
          this.finishRenderingSnapshot(renderer);
        } finally {
          delete this.renderer;
          this.resolveRenderPromise(void 0);
          delete this.renderPromise;
        }
      } else {
        this.invalidate();
      }
    }
    invalidate() {
      this.delegate.viewInvalidated();
    }
    prepareToRenderSnapshot(renderer) {
      this.markAsPreview(renderer.isPreview);
      renderer.prepareToRender();
    }
    markAsPreview(isPreview) {
      if (isPreview) {
        this.element.setAttribute("data-turbo-preview", "");
      } else {
        this.element.removeAttribute("data-turbo-preview");
      }
    }
    async renderSnapshot(renderer) {
      await renderer.render();
    }
    finishRenderingSnapshot(renderer) {
      renderer.finishRendering();
    }
  };
  var FrameView = class extends View {
    invalidate() {
      this.element.innerHTML = "";
    }
    get snapshot() {
      return new Snapshot(this.element);
    }
  };
  var LinkInterceptor = class {
    constructor(delegate, element) {
      this.clickBubbled = (event) => {
        if (this.respondsToEventTarget(event.target)) {
          this.clickEvent = event;
        } else {
          delete this.clickEvent;
        }
      };
      this.linkClicked = (event) => {
        if (this.clickEvent && this.respondsToEventTarget(event.target) && event.target instanceof Element) {
          if (this.delegate.shouldInterceptLinkClick(event.target, event.detail.url)) {
            this.clickEvent.preventDefault();
            event.preventDefault();
            this.delegate.linkClickIntercepted(event.target, event.detail.url);
          }
        }
        delete this.clickEvent;
      };
      this.willVisit = () => {
        delete this.clickEvent;
      };
      this.delegate = delegate;
      this.element = element;
    }
    start() {
      this.element.addEventListener("click", this.clickBubbled);
      document.addEventListener("turbo:click", this.linkClicked);
      document.addEventListener("turbo:before-visit", this.willVisit);
    }
    stop() {
      this.element.removeEventListener("click", this.clickBubbled);
      document.removeEventListener("turbo:click", this.linkClicked);
      document.removeEventListener("turbo:before-visit", this.willVisit);
    }
    respondsToEventTarget(target) {
      const element = target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
      return element && element.closest("turbo-frame, html") == this.element;
    }
  };
  var Bardo = class {
    constructor(permanentElementMap) {
      this.permanentElementMap = permanentElementMap;
    }
    static preservingPermanentElements(permanentElementMap, callback) {
      const bardo = new this(permanentElementMap);
      bardo.enter();
      callback();
      bardo.leave();
    }
    enter() {
      for (const id in this.permanentElementMap) {
        const [, newPermanentElement] = this.permanentElementMap[id];
        this.replaceNewPermanentElementWithPlaceholder(newPermanentElement);
      }
    }
    leave() {
      for (const id in this.permanentElementMap) {
        const [currentPermanentElement] = this.permanentElementMap[id];
        this.replaceCurrentPermanentElementWithClone(currentPermanentElement);
        this.replacePlaceholderWithPermanentElement(currentPermanentElement);
      }
    }
    replaceNewPermanentElementWithPlaceholder(permanentElement) {
      const placeholder = createPlaceholderForPermanentElement(permanentElement);
      permanentElement.replaceWith(placeholder);
    }
    replaceCurrentPermanentElementWithClone(permanentElement) {
      const clone = permanentElement.cloneNode(true);
      permanentElement.replaceWith(clone);
    }
    replacePlaceholderWithPermanentElement(permanentElement) {
      const placeholder = this.getPlaceholderById(permanentElement.id);
      placeholder === null || placeholder === void 0 ? void 0 : placeholder.replaceWith(permanentElement);
    }
    getPlaceholderById(id) {
      return this.placeholders.find((element) => element.content == id);
    }
    get placeholders() {
      return [...document.querySelectorAll("meta[name=turbo-permanent-placeholder][content]")];
    }
  };
  function createPlaceholderForPermanentElement(permanentElement) {
    const element = document.createElement("meta");
    element.setAttribute("name", "turbo-permanent-placeholder");
    element.setAttribute("content", permanentElement.id);
    return element;
  }
  var Renderer = class {
    constructor(currentSnapshot, newSnapshot, isPreview) {
      this.currentSnapshot = currentSnapshot;
      this.newSnapshot = newSnapshot;
      this.isPreview = isPreview;
      this.promise = new Promise((resolve, reject) => this.resolvingFunctions = { resolve, reject });
    }
    get shouldRender() {
      return true;
    }
    prepareToRender() {
      return;
    }
    finishRendering() {
      if (this.resolvingFunctions) {
        this.resolvingFunctions.resolve();
        delete this.resolvingFunctions;
      }
    }
    createScriptElement(element) {
      if (element.getAttribute("data-turbo-eval") == "false") {
        return element;
      } else {
        const createdScriptElement = document.createElement("script");
        if (this.cspNonce) {
          createdScriptElement.nonce = this.cspNonce;
        }
        createdScriptElement.textContent = element.textContent;
        createdScriptElement.async = false;
        copyElementAttributes(createdScriptElement, element);
        return createdScriptElement;
      }
    }
    preservingPermanentElements(callback) {
      Bardo.preservingPermanentElements(this.permanentElementMap, callback);
    }
    focusFirstAutofocusableElement() {
      const element = this.connectedSnapshot.firstAutofocusableElement;
      if (elementIsFocusable(element)) {
        element.focus();
      }
    }
    get connectedSnapshot() {
      return this.newSnapshot.isConnected ? this.newSnapshot : this.currentSnapshot;
    }
    get currentElement() {
      return this.currentSnapshot.element;
    }
    get newElement() {
      return this.newSnapshot.element;
    }
    get permanentElementMap() {
      return this.currentSnapshot.getPermanentElementMapForSnapshot(this.newSnapshot);
    }
    get cspNonce() {
      var _a;
      return (_a = document.head.querySelector('meta[name="csp-nonce"]')) === null || _a === void 0 ? void 0 : _a.getAttribute("content");
    }
  };
  function copyElementAttributes(destinationElement, sourceElement) {
    for (const { name, value } of [...sourceElement.attributes]) {
      destinationElement.setAttribute(name, value);
    }
  }
  function elementIsFocusable(element) {
    return element && typeof element.focus == "function";
  }
  var FrameRenderer = class extends Renderer {
    get shouldRender() {
      return true;
    }
    async render() {
      await nextAnimationFrame();
      this.preservingPermanentElements(() => {
        this.loadFrameElement();
      });
      this.scrollFrameIntoView();
      await nextAnimationFrame();
      this.focusFirstAutofocusableElement();
      await nextAnimationFrame();
      this.activateScriptElements();
    }
    loadFrameElement() {
      var _a;
      const destinationRange = document.createRange();
      destinationRange.selectNodeContents(this.currentElement);
      destinationRange.deleteContents();
      const frameElement = this.newElement;
      const sourceRange = (_a = frameElement.ownerDocument) === null || _a === void 0 ? void 0 : _a.createRange();
      if (sourceRange) {
        sourceRange.selectNodeContents(frameElement);
        this.currentElement.appendChild(sourceRange.extractContents());
      }
    }
    scrollFrameIntoView() {
      if (this.currentElement.autoscroll || this.newElement.autoscroll) {
        const element = this.currentElement.firstElementChild;
        const block = readScrollLogicalPosition(this.currentElement.getAttribute("data-autoscroll-block"), "end");
        if (element) {
          element.scrollIntoView({ block });
          return true;
        }
      }
      return false;
    }
    activateScriptElements() {
      for (const inertScriptElement of this.newScriptElements) {
        const activatedScriptElement = this.createScriptElement(inertScriptElement);
        inertScriptElement.replaceWith(activatedScriptElement);
      }
    }
    get newScriptElements() {
      return this.currentElement.querySelectorAll("script");
    }
  };
  function readScrollLogicalPosition(value, defaultValue) {
    if (value == "end" || value == "start" || value == "center" || value == "nearest") {
      return value;
    } else {
      return defaultValue;
    }
  }
  var ProgressBar = class {
    constructor() {
      this.hiding = false;
      this.value = 0;
      this.visible = false;
      this.trickle = () => {
        this.setValue(this.value + Math.random() / 100);
      };
      this.stylesheetElement = this.createStylesheetElement();
      this.progressElement = this.createProgressElement();
      this.installStylesheetElement();
      this.setValue(0);
    }
    static get defaultCSS() {
      return unindent`
      .turbo-progress-bar {
        position: fixed;
        display: block;
        top: 0;
        left: 0;
        height: 3px;
        background: #0076ff;
        z-index: 9999;
        transition:
          width ${ProgressBar.animationDuration}ms ease-out,
          opacity ${ProgressBar.animationDuration / 2}ms ${ProgressBar.animationDuration / 2}ms ease-in;
        transform: translate3d(0, 0, 0);
      }
    `;
    }
    show() {
      if (!this.visible) {
        this.visible = true;
        this.installProgressElement();
        this.startTrickling();
      }
    }
    hide() {
      if (this.visible && !this.hiding) {
        this.hiding = true;
        this.fadeProgressElement(() => {
          this.uninstallProgressElement();
          this.stopTrickling();
          this.visible = false;
          this.hiding = false;
        });
      }
    }
    setValue(value) {
      this.value = value;
      this.refresh();
    }
    installStylesheetElement() {
      document.head.insertBefore(this.stylesheetElement, document.head.firstChild);
    }
    installProgressElement() {
      this.progressElement.style.width = "0";
      this.progressElement.style.opacity = "1";
      document.documentElement.insertBefore(this.progressElement, document.body);
      this.refresh();
    }
    fadeProgressElement(callback) {
      this.progressElement.style.opacity = "0";
      setTimeout(callback, ProgressBar.animationDuration * 1.5);
    }
    uninstallProgressElement() {
      if (this.progressElement.parentNode) {
        document.documentElement.removeChild(this.progressElement);
      }
    }
    startTrickling() {
      if (!this.trickleInterval) {
        this.trickleInterval = window.setInterval(this.trickle, ProgressBar.animationDuration);
      }
    }
    stopTrickling() {
      window.clearInterval(this.trickleInterval);
      delete this.trickleInterval;
    }
    refresh() {
      requestAnimationFrame(() => {
        this.progressElement.style.width = `${10 + this.value * 90}%`;
      });
    }
    createStylesheetElement() {
      const element = document.createElement("style");
      element.type = "text/css";
      element.textContent = ProgressBar.defaultCSS;
      return element;
    }
    createProgressElement() {
      const element = document.createElement("div");
      element.className = "turbo-progress-bar";
      return element;
    }
  };
  ProgressBar.animationDuration = 300;
  var HeadSnapshot = class extends Snapshot {
    constructor() {
      super(...arguments);
      this.detailsByOuterHTML = this.children.filter((element) => !elementIsNoscript(element)).map((element) => elementWithoutNonce(element)).reduce((result, element) => {
        const { outerHTML } = element;
        const details = outerHTML in result ? result[outerHTML] : {
          type: elementType(element),
          tracked: elementIsTracked(element),
          elements: []
        };
        return Object.assign(Object.assign({}, result), { [outerHTML]: Object.assign(Object.assign({}, details), { elements: [...details.elements, element] }) });
      }, {});
    }
    get trackedElementSignature() {
      return Object.keys(this.detailsByOuterHTML).filter((outerHTML) => this.detailsByOuterHTML[outerHTML].tracked).join("");
    }
    getScriptElementsNotInSnapshot(snapshot) {
      return this.getElementsMatchingTypeNotInSnapshot("script", snapshot);
    }
    getStylesheetElementsNotInSnapshot(snapshot) {
      return this.getElementsMatchingTypeNotInSnapshot("stylesheet", snapshot);
    }
    getElementsMatchingTypeNotInSnapshot(matchedType, snapshot) {
      return Object.keys(this.detailsByOuterHTML).filter((outerHTML) => !(outerHTML in snapshot.detailsByOuterHTML)).map((outerHTML) => this.detailsByOuterHTML[outerHTML]).filter(({ type }) => type == matchedType).map(({ elements: [element] }) => element);
    }
    get provisionalElements() {
      return Object.keys(this.detailsByOuterHTML).reduce((result, outerHTML) => {
        const { type, tracked, elements } = this.detailsByOuterHTML[outerHTML];
        if (type == null && !tracked) {
          return [...result, ...elements];
        } else if (elements.length > 1) {
          return [...result, ...elements.slice(1)];
        } else {
          return result;
        }
      }, []);
    }
    getMetaValue(name) {
      const element = this.findMetaElementByName(name);
      return element ? element.getAttribute("content") : null;
    }
    findMetaElementByName(name) {
      return Object.keys(this.detailsByOuterHTML).reduce((result, outerHTML) => {
        const { elements: [element] } = this.detailsByOuterHTML[outerHTML];
        return elementIsMetaElementWithName(element, name) ? element : result;
      }, void 0);
    }
  };
  function elementType(element) {
    if (elementIsScript(element)) {
      return "script";
    } else if (elementIsStylesheet(element)) {
      return "stylesheet";
    }
  }
  function elementIsTracked(element) {
    return element.getAttribute("data-turbo-track") == "reload";
  }
  function elementIsScript(element) {
    const tagName = element.tagName.toLowerCase();
    return tagName == "script";
  }
  function elementIsNoscript(element) {
    const tagName = element.tagName.toLowerCase();
    return tagName == "noscript";
  }
  function elementIsStylesheet(element) {
    const tagName = element.tagName.toLowerCase();
    return tagName == "style" || tagName == "link" && element.getAttribute("rel") == "stylesheet";
  }
  function elementIsMetaElementWithName(element, name) {
    const tagName = element.tagName.toLowerCase();
    return tagName == "meta" && element.getAttribute("name") == name;
  }
  function elementWithoutNonce(element) {
    if (element.hasAttribute("nonce")) {
      element.setAttribute("nonce", "");
    }
    return element;
  }
  var PageSnapshot = class extends Snapshot {
    constructor(element, headSnapshot) {
      super(element);
      this.headSnapshot = headSnapshot;
    }
    static fromHTMLString(html = "") {
      return this.fromDocument(parseHTMLDocument(html));
    }
    static fromElement(element) {
      return this.fromDocument(element.ownerDocument);
    }
    static fromDocument({ head, body }) {
      return new this(body, new HeadSnapshot(head));
    }
    clone() {
      return new PageSnapshot(this.element.cloneNode(true), this.headSnapshot);
    }
    get headElement() {
      return this.headSnapshot.element;
    }
    get rootLocation() {
      var _a;
      const root = (_a = this.getSetting("root")) !== null && _a !== void 0 ? _a : "/";
      return expandURL(root);
    }
    get cacheControlValue() {
      return this.getSetting("cache-control");
    }
    get isPreviewable() {
      return this.cacheControlValue != "no-preview";
    }
    get isCacheable() {
      return this.cacheControlValue != "no-cache";
    }
    get isVisitable() {
      return this.getSetting("visit-control") != "reload";
    }
    getSetting(name) {
      return this.headSnapshot.getMetaValue(`turbo-${name}`);
    }
  };
  var TimingMetric;
  (function(TimingMetric2) {
    TimingMetric2["visitStart"] = "visitStart";
    TimingMetric2["requestStart"] = "requestStart";
    TimingMetric2["requestEnd"] = "requestEnd";
    TimingMetric2["visitEnd"] = "visitEnd";
  })(TimingMetric || (TimingMetric = {}));
  var VisitState;
  (function(VisitState2) {
    VisitState2["initialized"] = "initialized";
    VisitState2["started"] = "started";
    VisitState2["canceled"] = "canceled";
    VisitState2["failed"] = "failed";
    VisitState2["completed"] = "completed";
  })(VisitState || (VisitState = {}));
  var defaultOptions = {
    action: "advance",
    historyChanged: false
  };
  var SystemStatusCode;
  (function(SystemStatusCode2) {
    SystemStatusCode2[SystemStatusCode2["networkFailure"] = 0] = "networkFailure";
    SystemStatusCode2[SystemStatusCode2["timeoutFailure"] = -1] = "timeoutFailure";
    SystemStatusCode2[SystemStatusCode2["contentTypeMismatch"] = -2] = "contentTypeMismatch";
  })(SystemStatusCode || (SystemStatusCode = {}));
  var Visit = class {
    constructor(delegate, location2, restorationIdentifier, options = {}) {
      this.identifier = uuid();
      this.timingMetrics = {};
      this.followedRedirect = false;
      this.historyChanged = false;
      this.scrolled = false;
      this.snapshotCached = false;
      this.state = VisitState.initialized;
      this.delegate = delegate;
      this.location = location2;
      this.restorationIdentifier = restorationIdentifier || uuid();
      const { action, historyChanged, referrer, snapshotHTML, response } = Object.assign(Object.assign({}, defaultOptions), options);
      this.action = action;
      this.historyChanged = historyChanged;
      this.referrer = referrer;
      this.snapshotHTML = snapshotHTML;
      this.response = response;
      this.isSamePage = this.delegate.locationWithActionIsSamePage(this.location, this.action);
    }
    get adapter() {
      return this.delegate.adapter;
    }
    get view() {
      return this.delegate.view;
    }
    get history() {
      return this.delegate.history;
    }
    get restorationData() {
      return this.history.getRestorationDataForIdentifier(this.restorationIdentifier);
    }
    get silent() {
      return this.isSamePage;
    }
    start() {
      if (this.state == VisitState.initialized) {
        this.recordTimingMetric(TimingMetric.visitStart);
        this.state = VisitState.started;
        this.adapter.visitStarted(this);
        this.delegate.visitStarted(this);
      }
    }
    cancel() {
      if (this.state == VisitState.started) {
        if (this.request) {
          this.request.cancel();
        }
        this.cancelRender();
        this.state = VisitState.canceled;
      }
    }
    complete() {
      if (this.state == VisitState.started) {
        this.recordTimingMetric(TimingMetric.visitEnd);
        this.state = VisitState.completed;
        this.adapter.visitCompleted(this);
        this.delegate.visitCompleted(this);
        this.followRedirect();
      }
    }
    fail() {
      if (this.state == VisitState.started) {
        this.state = VisitState.failed;
        this.adapter.visitFailed(this);
      }
    }
    changeHistory() {
      var _a;
      if (!this.historyChanged) {
        const actionForHistory = this.location.href === ((_a = this.referrer) === null || _a === void 0 ? void 0 : _a.href) ? "replace" : this.action;
        const method = this.getHistoryMethodForAction(actionForHistory);
        this.history.update(method, this.location, this.restorationIdentifier);
        this.historyChanged = true;
      }
    }
    issueRequest() {
      if (this.hasPreloadedResponse()) {
        this.simulateRequest();
      } else if (this.shouldIssueRequest() && !this.request) {
        this.request = new FetchRequest(this, FetchMethod.get, this.location);
        this.request.perform();
      }
    }
    simulateRequest() {
      if (this.response) {
        this.startRequest();
        this.recordResponse();
        this.finishRequest();
      }
    }
    startRequest() {
      this.recordTimingMetric(TimingMetric.requestStart);
      this.adapter.visitRequestStarted(this);
    }
    recordResponse(response = this.response) {
      this.response = response;
      if (response) {
        const { statusCode } = response;
        if (isSuccessful(statusCode)) {
          this.adapter.visitRequestCompleted(this);
        } else {
          this.adapter.visitRequestFailedWithStatusCode(this, statusCode);
        }
      }
    }
    finishRequest() {
      this.recordTimingMetric(TimingMetric.requestEnd);
      this.adapter.visitRequestFinished(this);
    }
    loadResponse() {
      if (this.response) {
        const { statusCode, responseHTML } = this.response;
        this.render(async () => {
          this.cacheSnapshot();
          if (this.view.renderPromise)
            await this.view.renderPromise;
          if (isSuccessful(statusCode) && responseHTML != null) {
            await this.view.renderPage(PageSnapshot.fromHTMLString(responseHTML));
            this.adapter.visitRendered(this);
            this.complete();
          } else {
            await this.view.renderError(PageSnapshot.fromHTMLString(responseHTML));
            this.adapter.visitRendered(this);
            this.fail();
          }
        });
      }
    }
    getCachedSnapshot() {
      const snapshot = this.view.getCachedSnapshotForLocation(this.location) || this.getPreloadedSnapshot();
      if (snapshot && (!getAnchor(this.location) || snapshot.hasAnchor(getAnchor(this.location)))) {
        if (this.action == "restore" || snapshot.isPreviewable) {
          return snapshot;
        }
      }
    }
    getPreloadedSnapshot() {
      if (this.snapshotHTML) {
        return PageSnapshot.fromHTMLString(this.snapshotHTML);
      }
    }
    hasCachedSnapshot() {
      return this.getCachedSnapshot() != null;
    }
    loadCachedSnapshot() {
      const snapshot = this.getCachedSnapshot();
      if (snapshot) {
        const isPreview = this.shouldIssueRequest();
        this.render(async () => {
          this.cacheSnapshot();
          if (this.isSamePage) {
            this.adapter.visitRendered(this);
          } else {
            if (this.view.renderPromise)
              await this.view.renderPromise;
            await this.view.renderPage(snapshot, isPreview);
            this.adapter.visitRendered(this);
            if (!isPreview) {
              this.complete();
            }
          }
        });
      }
    }
    followRedirect() {
      if (this.redirectedToLocation && !this.followedRedirect) {
        this.adapter.visitProposedToLocation(this.redirectedToLocation, {
          action: "replace",
          response: this.response
        });
        this.followedRedirect = true;
      }
    }
    goToSamePageAnchor() {
      if (this.isSamePage) {
        this.render(async () => {
          this.cacheSnapshot();
          this.adapter.visitRendered(this);
        });
      }
    }
    requestStarted() {
      this.startRequest();
    }
    requestPreventedHandlingResponse(request2, response) {
    }
    async requestSucceededWithResponse(request2, response) {
      const responseHTML = await response.responseHTML;
      if (responseHTML == void 0) {
        this.recordResponse({ statusCode: SystemStatusCode.contentTypeMismatch });
      } else {
        this.redirectedToLocation = response.redirected ? response.location : void 0;
        this.recordResponse({ statusCode: response.statusCode, responseHTML });
      }
    }
    async requestFailedWithResponse(request2, response) {
      const responseHTML = await response.responseHTML;
      if (responseHTML == void 0) {
        this.recordResponse({ statusCode: SystemStatusCode.contentTypeMismatch });
      } else {
        this.recordResponse({ statusCode: response.statusCode, responseHTML });
      }
    }
    requestErrored(request2, error4) {
      this.recordResponse({ statusCode: SystemStatusCode.networkFailure });
    }
    requestFinished() {
      this.finishRequest();
    }
    performScroll() {
      if (!this.scrolled) {
        if (this.action == "restore") {
          this.scrollToRestoredPosition() || this.scrollToAnchor() || this.view.scrollToTop();
        } else {
          this.scrollToAnchor() || this.view.scrollToTop();
        }
        if (this.isSamePage) {
          this.delegate.visitScrolledToSamePageLocation(this.view.lastRenderedLocation, this.location);
        }
        this.scrolled = true;
      }
    }
    scrollToRestoredPosition() {
      const { scrollPosition } = this.restorationData;
      if (scrollPosition) {
        this.view.scrollToPosition(scrollPosition);
        return true;
      }
    }
    scrollToAnchor() {
      const anchor = getAnchor(this.location);
      if (anchor != null) {
        this.view.scrollToAnchor(anchor);
        return true;
      }
    }
    recordTimingMetric(metric) {
      this.timingMetrics[metric] = new Date().getTime();
    }
    getTimingMetrics() {
      return Object.assign({}, this.timingMetrics);
    }
    getHistoryMethodForAction(action) {
      switch (action) {
        case "replace":
          return history.replaceState;
        case "advance":
        case "restore":
          return history.pushState;
      }
    }
    hasPreloadedResponse() {
      return typeof this.response == "object";
    }
    shouldIssueRequest() {
      if (this.isSamePage) {
        return false;
      } else if (this.action == "restore") {
        return !this.hasCachedSnapshot();
      } else {
        return true;
      }
    }
    cacheSnapshot() {
      if (!this.snapshotCached) {
        this.view.cacheSnapshot();
        this.snapshotCached = true;
      }
    }
    async render(callback) {
      this.cancelRender();
      await new Promise((resolve) => {
        this.frame = requestAnimationFrame(() => resolve());
      });
      await callback();
      delete this.frame;
      this.performScroll();
    }
    cancelRender() {
      if (this.frame) {
        cancelAnimationFrame(this.frame);
        delete this.frame;
      }
    }
  };
  function isSuccessful(statusCode) {
    return statusCode >= 200 && statusCode < 300;
  }
  var BrowserAdapter = class {
    constructor(session2) {
      this.progressBar = new ProgressBar();
      this.showProgressBar = () => {
        this.progressBar.show();
      };
      this.session = session2;
    }
    visitProposedToLocation(location2, options) {
      this.navigator.startVisit(location2, uuid(), options);
    }
    visitStarted(visit2) {
      visit2.issueRequest();
      visit2.changeHistory();
      visit2.goToSamePageAnchor();
      visit2.loadCachedSnapshot();
    }
    visitRequestStarted(visit2) {
      this.progressBar.setValue(0);
      if (visit2.hasCachedSnapshot() || visit2.action != "restore") {
        this.showVisitProgressBarAfterDelay();
      } else {
        this.showProgressBar();
      }
    }
    visitRequestCompleted(visit2) {
      visit2.loadResponse();
    }
    visitRequestFailedWithStatusCode(visit2, statusCode) {
      switch (statusCode) {
        case SystemStatusCode.networkFailure:
        case SystemStatusCode.timeoutFailure:
        case SystemStatusCode.contentTypeMismatch:
          return this.reload();
        default:
          return visit2.loadResponse();
      }
    }
    visitRequestFinished(visit2) {
      this.progressBar.setValue(1);
      this.hideVisitProgressBar();
    }
    visitCompleted(visit2) {
    }
    pageInvalidated() {
      this.reload();
    }
    visitFailed(visit2) {
    }
    visitRendered(visit2) {
    }
    formSubmissionStarted(formSubmission) {
      this.progressBar.setValue(0);
      this.showFormProgressBarAfterDelay();
    }
    formSubmissionFinished(formSubmission) {
      this.progressBar.setValue(1);
      this.hideFormProgressBar();
    }
    showVisitProgressBarAfterDelay() {
      this.visitProgressBarTimeout = window.setTimeout(this.showProgressBar, this.session.progressBarDelay);
    }
    hideVisitProgressBar() {
      this.progressBar.hide();
      if (this.visitProgressBarTimeout != null) {
        window.clearTimeout(this.visitProgressBarTimeout);
        delete this.visitProgressBarTimeout;
      }
    }
    showFormProgressBarAfterDelay() {
      if (this.formProgressBarTimeout == null) {
        this.formProgressBarTimeout = window.setTimeout(this.showProgressBar, this.session.progressBarDelay);
      }
    }
    hideFormProgressBar() {
      this.progressBar.hide();
      if (this.formProgressBarTimeout != null) {
        window.clearTimeout(this.formProgressBarTimeout);
        delete this.formProgressBarTimeout;
      }
    }
    reload() {
      window.location.reload();
    }
    get navigator() {
      return this.session.navigator;
    }
  };
  var CacheObserver = class {
    constructor() {
      this.started = false;
    }
    start() {
      if (!this.started) {
        this.started = true;
        addEventListener("turbo:before-cache", this.removeStaleElements, false);
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        removeEventListener("turbo:before-cache", this.removeStaleElements, false);
      }
    }
    removeStaleElements() {
      const staleElements = [...document.querySelectorAll('[data-turbo-cache="false"]')];
      for (const element of staleElements) {
        element.remove();
      }
    }
  };
  var FormSubmitObserver = class {
    constructor(delegate) {
      this.started = false;
      this.submitCaptured = () => {
        removeEventListener("submit", this.submitBubbled, false);
        addEventListener("submit", this.submitBubbled, false);
      };
      this.submitBubbled = (event) => {
        if (!event.defaultPrevented) {
          const form = event.target instanceof HTMLFormElement ? event.target : void 0;
          const submitter = event.submitter || void 0;
          if (form) {
            const method = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("formmethod")) || form.method;
            if (method != "dialog" && this.delegate.willSubmitForm(form, submitter)) {
              event.preventDefault();
              this.delegate.formSubmitted(form, submitter);
            }
          }
        }
      };
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        addEventListener("submit", this.submitCaptured, true);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        removeEventListener("submit", this.submitCaptured, true);
        this.started = false;
      }
    }
  };
  var FrameRedirector = class {
    constructor(element) {
      this.element = element;
      this.linkInterceptor = new LinkInterceptor(this, element);
      this.formInterceptor = new FormInterceptor(this, element);
    }
    start() {
      this.linkInterceptor.start();
      this.formInterceptor.start();
    }
    stop() {
      this.linkInterceptor.stop();
      this.formInterceptor.stop();
    }
    shouldInterceptLinkClick(element, url2) {
      return this.shouldRedirect(element);
    }
    linkClickIntercepted(element, url2) {
      const frame = this.findFrameElement(element);
      if (frame) {
        frame.setAttribute("reloadable", "");
        frame.src = url2;
      }
    }
    shouldInterceptFormSubmission(element, submitter) {
      return this.shouldRedirect(element, submitter);
    }
    formSubmissionIntercepted(element, submitter) {
      const frame = this.findFrameElement(element, submitter);
      if (frame) {
        frame.removeAttribute("reloadable");
        frame.delegate.formSubmissionIntercepted(element, submitter);
      }
    }
    shouldRedirect(element, submitter) {
      const frame = this.findFrameElement(element, submitter);
      return frame ? frame != element.closest("turbo-frame") : false;
    }
    findFrameElement(element, submitter) {
      const id = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("data-turbo-frame")) || element.getAttribute("data-turbo-frame");
      if (id && id != "_top") {
        const frame = this.element.querySelector(`#${id}:not([disabled])`);
        if (frame instanceof FrameElement) {
          return frame;
        }
      }
    }
  };
  var History = class {
    constructor(delegate) {
      this.restorationIdentifier = uuid();
      this.restorationData = {};
      this.started = false;
      this.pageLoaded = false;
      this.onPopState = (event) => {
        if (this.shouldHandlePopState()) {
          const { turbo } = event.state || {};
          if (turbo) {
            this.location = new URL(window.location.href);
            const { restorationIdentifier } = turbo;
            this.restorationIdentifier = restorationIdentifier;
            this.delegate.historyPoppedToLocationWithRestorationIdentifier(this.location, restorationIdentifier);
          }
        }
      };
      this.onPageLoad = async (event) => {
        await nextMicrotask();
        this.pageLoaded = true;
      };
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        addEventListener("popstate", this.onPopState, false);
        addEventListener("load", this.onPageLoad, false);
        this.started = true;
        this.replace(new URL(window.location.href));
      }
    }
    stop() {
      if (this.started) {
        removeEventListener("popstate", this.onPopState, false);
        removeEventListener("load", this.onPageLoad, false);
        this.started = false;
      }
    }
    push(location2, restorationIdentifier) {
      this.update(history.pushState, location2, restorationIdentifier);
    }
    replace(location2, restorationIdentifier) {
      this.update(history.replaceState, location2, restorationIdentifier);
    }
    update(method, location2, restorationIdentifier = uuid()) {
      const state = { turbo: { restorationIdentifier } };
      method.call(history, state, "", location2.href);
      this.location = location2;
      this.restorationIdentifier = restorationIdentifier;
    }
    getRestorationDataForIdentifier(restorationIdentifier) {
      return this.restorationData[restorationIdentifier] || {};
    }
    updateRestorationData(additionalData) {
      const { restorationIdentifier } = this;
      const restorationData = this.restorationData[restorationIdentifier];
      this.restorationData[restorationIdentifier] = Object.assign(Object.assign({}, restorationData), additionalData);
    }
    assumeControlOfScrollRestoration() {
      var _a;
      if (!this.previousScrollRestoration) {
        this.previousScrollRestoration = (_a = history.scrollRestoration) !== null && _a !== void 0 ? _a : "auto";
        history.scrollRestoration = "manual";
      }
    }
    relinquishControlOfScrollRestoration() {
      if (this.previousScrollRestoration) {
        history.scrollRestoration = this.previousScrollRestoration;
        delete this.previousScrollRestoration;
      }
    }
    shouldHandlePopState() {
      return this.pageIsLoaded();
    }
    pageIsLoaded() {
      return this.pageLoaded || document.readyState == "complete";
    }
  };
  var LinkClickObserver = class {
    constructor(delegate) {
      this.started = false;
      this.clickCaptured = () => {
        removeEventListener("click", this.clickBubbled, false);
        addEventListener("click", this.clickBubbled, false);
      };
      this.clickBubbled = (event) => {
        if (this.clickEventIsSignificant(event)) {
          const target = event.composedPath && event.composedPath()[0] || event.target;
          const link = this.findLinkFromClickTarget(target);
          if (link) {
            const location2 = this.getLocationForLink(link);
            if (this.delegate.willFollowLinkToLocation(link, location2)) {
              event.preventDefault();
              this.delegate.followedLinkToLocation(link, location2);
            }
          }
        }
      };
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        addEventListener("click", this.clickCaptured, true);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        removeEventListener("click", this.clickCaptured, true);
        this.started = false;
      }
    }
    clickEventIsSignificant(event) {
      return !(event.target && event.target.isContentEditable || event.defaultPrevented || event.which > 1 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey);
    }
    findLinkFromClickTarget(target) {
      if (target instanceof Element) {
        return target.closest("a[href]:not([target^=_]):not([download])");
      }
    }
    getLocationForLink(link) {
      return expandURL(link.getAttribute("href") || "");
    }
  };
  function isAction(action) {
    return action == "advance" || action == "replace" || action == "restore";
  }
  var Navigator = class {
    constructor(delegate) {
      this.delegate = delegate;
    }
    proposeVisit(location2, options = {}) {
      if (this.delegate.allowsVisitingLocationWithAction(location2, options.action)) {
        this.delegate.visitProposedToLocation(location2, options);
      }
    }
    startVisit(locatable, restorationIdentifier, options = {}) {
      this.stop();
      this.currentVisit = new Visit(this, expandURL(locatable), restorationIdentifier, Object.assign({ referrer: this.location }, options));
      this.currentVisit.start();
    }
    submitForm(form, submitter) {
      this.stop();
      this.formSubmission = new FormSubmission(this, form, submitter, true);
      if (this.formSubmission.isIdempotent) {
        this.proposeVisit(this.formSubmission.fetchRequest.url, { action: this.getActionForFormSubmission(this.formSubmission) });
      } else {
        this.formSubmission.start();
      }
    }
    stop() {
      if (this.formSubmission) {
        this.formSubmission.stop();
        delete this.formSubmission;
      }
      if (this.currentVisit) {
        this.currentVisit.cancel();
        delete this.currentVisit;
      }
    }
    get adapter() {
      return this.delegate.adapter;
    }
    get view() {
      return this.delegate.view;
    }
    get history() {
      return this.delegate.history;
    }
    formSubmissionStarted(formSubmission) {
      if (typeof this.adapter.formSubmissionStarted === "function") {
        this.adapter.formSubmissionStarted(formSubmission);
      }
    }
    async formSubmissionSucceededWithResponse(formSubmission, fetchResponse) {
      if (formSubmission == this.formSubmission) {
        const responseHTML = await fetchResponse.responseHTML;
        if (responseHTML) {
          if (formSubmission.method != FetchMethod.get) {
            this.view.clearSnapshotCache();
          }
          const { statusCode } = fetchResponse;
          const visitOptions = { response: { statusCode, responseHTML } };
          this.proposeVisit(fetchResponse.location, visitOptions);
        }
      }
    }
    async formSubmissionFailedWithResponse(formSubmission, fetchResponse) {
      const responseHTML = await fetchResponse.responseHTML;
      if (responseHTML) {
        const snapshot = PageSnapshot.fromHTMLString(responseHTML);
        if (fetchResponse.serverError) {
          await this.view.renderError(snapshot);
        } else {
          await this.view.renderPage(snapshot);
        }
        this.view.scrollToTop();
        this.view.clearSnapshotCache();
      }
    }
    formSubmissionErrored(formSubmission, error4) {
      console.error(error4);
    }
    formSubmissionFinished(formSubmission) {
      if (typeof this.adapter.formSubmissionFinished === "function") {
        this.adapter.formSubmissionFinished(formSubmission);
      }
    }
    visitStarted(visit2) {
      this.delegate.visitStarted(visit2);
    }
    visitCompleted(visit2) {
      this.delegate.visitCompleted(visit2);
    }
    locationWithActionIsSamePage(location2, action) {
      const anchor = getAnchor(location2);
      const currentAnchor = getAnchor(this.view.lastRenderedLocation);
      const isRestorationToTop = action === "restore" && typeof anchor === "undefined";
      return action !== "replace" && getRequestURL(location2) === getRequestURL(this.view.lastRenderedLocation) && (isRestorationToTop || anchor != null && anchor !== currentAnchor);
    }
    visitScrolledToSamePageLocation(oldURL, newURL) {
      this.delegate.visitScrolledToSamePageLocation(oldURL, newURL);
    }
    get location() {
      return this.history.location;
    }
    get restorationIdentifier() {
      return this.history.restorationIdentifier;
    }
    getActionForFormSubmission(formSubmission) {
      const { formElement, submitter } = formSubmission;
      const action = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("data-turbo-action")) || formElement.getAttribute("data-turbo-action");
      return isAction(action) ? action : "advance";
    }
  };
  var PageStage;
  (function(PageStage2) {
    PageStage2[PageStage2["initial"] = 0] = "initial";
    PageStage2[PageStage2["loading"] = 1] = "loading";
    PageStage2[PageStage2["interactive"] = 2] = "interactive";
    PageStage2[PageStage2["complete"] = 3] = "complete";
  })(PageStage || (PageStage = {}));
  var PageObserver = class {
    constructor(delegate) {
      this.stage = PageStage.initial;
      this.started = false;
      this.interpretReadyState = () => {
        const { readyState } = this;
        if (readyState == "interactive") {
          this.pageIsInteractive();
        } else if (readyState == "complete") {
          this.pageIsComplete();
        }
      };
      this.pageWillUnload = () => {
        this.delegate.pageWillUnload();
      };
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        if (this.stage == PageStage.initial) {
          this.stage = PageStage.loading;
        }
        document.addEventListener("readystatechange", this.interpretReadyState, false);
        addEventListener("pagehide", this.pageWillUnload, false);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        document.removeEventListener("readystatechange", this.interpretReadyState, false);
        removeEventListener("pagehide", this.pageWillUnload, false);
        this.started = false;
      }
    }
    pageIsInteractive() {
      if (this.stage == PageStage.loading) {
        this.stage = PageStage.interactive;
        this.delegate.pageBecameInteractive();
      }
    }
    pageIsComplete() {
      this.pageIsInteractive();
      if (this.stage == PageStage.interactive) {
        this.stage = PageStage.complete;
        this.delegate.pageLoaded();
      }
    }
    get readyState() {
      return document.readyState;
    }
  };
  var ScrollObserver = class {
    constructor(delegate) {
      this.started = false;
      this.onScroll = () => {
        this.updatePosition({ x: window.pageXOffset, y: window.pageYOffset });
      };
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        addEventListener("scroll", this.onScroll, false);
        this.onScroll();
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        removeEventListener("scroll", this.onScroll, false);
        this.started = false;
      }
    }
    updatePosition(position) {
      this.delegate.scrollPositionChanged(position);
    }
  };
  var StreamObserver = class {
    constructor(delegate) {
      this.sources = new Set();
      this.started = false;
      this.inspectFetchResponse = (event) => {
        const response = fetchResponseFromEvent(event);
        if (response && fetchResponseIsStream(response)) {
          event.preventDefault();
          this.receiveMessageResponse(response);
        }
      };
      this.receiveMessageEvent = (event) => {
        if (this.started && typeof event.data == "string") {
          this.receiveMessageHTML(event.data);
        }
      };
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        this.started = true;
        addEventListener("turbo:before-fetch-response", this.inspectFetchResponse, false);
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        removeEventListener("turbo:before-fetch-response", this.inspectFetchResponse, false);
      }
    }
    connectStreamSource(source) {
      if (!this.streamSourceIsConnected(source)) {
        this.sources.add(source);
        source.addEventListener("message", this.receiveMessageEvent, false);
      }
    }
    disconnectStreamSource(source) {
      if (this.streamSourceIsConnected(source)) {
        this.sources.delete(source);
        source.removeEventListener("message", this.receiveMessageEvent, false);
      }
    }
    streamSourceIsConnected(source) {
      return this.sources.has(source);
    }
    async receiveMessageResponse(response) {
      const html = await response.responseHTML;
      if (html) {
        this.receiveMessageHTML(html);
      }
    }
    receiveMessageHTML(html) {
      this.delegate.receivedMessageFromStream(new StreamMessage(html));
    }
  };
  function fetchResponseFromEvent(event) {
    var _a;
    const fetchResponse = (_a = event.detail) === null || _a === void 0 ? void 0 : _a.fetchResponse;
    if (fetchResponse instanceof FetchResponse) {
      return fetchResponse;
    }
  }
  function fetchResponseIsStream(response) {
    var _a;
    const contentType = (_a = response.contentType) !== null && _a !== void 0 ? _a : "";
    return contentType.startsWith(StreamMessage.contentType);
  }
  var ErrorRenderer = class extends Renderer {
    async render() {
      this.replaceHeadAndBody();
      this.activateScriptElements();
    }
    replaceHeadAndBody() {
      const { documentElement, head, body } = document;
      documentElement.replaceChild(this.newHead, head);
      documentElement.replaceChild(this.newElement, body);
    }
    activateScriptElements() {
      for (const replaceableElement of this.scriptElements) {
        const parentNode = replaceableElement.parentNode;
        if (parentNode) {
          const element = this.createScriptElement(replaceableElement);
          parentNode.replaceChild(element, replaceableElement);
        }
      }
    }
    get newHead() {
      return this.newSnapshot.headSnapshot.element;
    }
    get scriptElements() {
      return [...document.documentElement.querySelectorAll("script")];
    }
  };
  var PageRenderer = class extends Renderer {
    get shouldRender() {
      return this.newSnapshot.isVisitable && this.trackedElementsAreIdentical;
    }
    prepareToRender() {
      this.mergeHead();
    }
    async render() {
      this.replaceBody();
    }
    finishRendering() {
      super.finishRendering();
      if (!this.isPreview) {
        this.focusFirstAutofocusableElement();
      }
    }
    get currentHeadSnapshot() {
      return this.currentSnapshot.headSnapshot;
    }
    get newHeadSnapshot() {
      return this.newSnapshot.headSnapshot;
    }
    get newElement() {
      return this.newSnapshot.element;
    }
    mergeHead() {
      this.copyNewHeadStylesheetElements();
      this.copyNewHeadScriptElements();
      this.removeCurrentHeadProvisionalElements();
      this.copyNewHeadProvisionalElements();
    }
    replaceBody() {
      this.preservingPermanentElements(() => {
        this.activateNewBody();
        this.assignNewBody();
      });
    }
    get trackedElementsAreIdentical() {
      return this.currentHeadSnapshot.trackedElementSignature == this.newHeadSnapshot.trackedElementSignature;
    }
    copyNewHeadStylesheetElements() {
      for (const element of this.newHeadStylesheetElements) {
        document.head.appendChild(element);
      }
    }
    copyNewHeadScriptElements() {
      for (const element of this.newHeadScriptElements) {
        document.head.appendChild(this.createScriptElement(element));
      }
    }
    removeCurrentHeadProvisionalElements() {
      for (const element of this.currentHeadProvisionalElements) {
        document.head.removeChild(element);
      }
    }
    copyNewHeadProvisionalElements() {
      for (const element of this.newHeadProvisionalElements) {
        document.head.appendChild(element);
      }
    }
    activateNewBody() {
      document.adoptNode(this.newElement);
      this.activateNewBodyScriptElements();
    }
    activateNewBodyScriptElements() {
      for (const inertScriptElement of this.newBodyScriptElements) {
        const activatedScriptElement = this.createScriptElement(inertScriptElement);
        inertScriptElement.replaceWith(activatedScriptElement);
      }
    }
    assignNewBody() {
      if (document.body && this.newElement instanceof HTMLBodyElement) {
        document.body.replaceWith(this.newElement);
      } else {
        document.documentElement.appendChild(this.newElement);
      }
    }
    get newHeadStylesheetElements() {
      return this.newHeadSnapshot.getStylesheetElementsNotInSnapshot(this.currentHeadSnapshot);
    }
    get newHeadScriptElements() {
      return this.newHeadSnapshot.getScriptElementsNotInSnapshot(this.currentHeadSnapshot);
    }
    get currentHeadProvisionalElements() {
      return this.currentHeadSnapshot.provisionalElements;
    }
    get newHeadProvisionalElements() {
      return this.newHeadSnapshot.provisionalElements;
    }
    get newBodyScriptElements() {
      return this.newElement.querySelectorAll("script");
    }
  };
  var SnapshotCache = class {
    constructor(size) {
      this.keys = [];
      this.snapshots = {};
      this.size = size;
    }
    has(location2) {
      return toCacheKey(location2) in this.snapshots;
    }
    get(location2) {
      if (this.has(location2)) {
        const snapshot = this.read(location2);
        this.touch(location2);
        return snapshot;
      }
    }
    put(location2, snapshot) {
      this.write(location2, snapshot);
      this.touch(location2);
      return snapshot;
    }
    clear() {
      this.snapshots = {};
    }
    read(location2) {
      return this.snapshots[toCacheKey(location2)];
    }
    write(location2, snapshot) {
      this.snapshots[toCacheKey(location2)] = snapshot;
    }
    touch(location2) {
      const key = toCacheKey(location2);
      const index = this.keys.indexOf(key);
      if (index > -1)
        this.keys.splice(index, 1);
      this.keys.unshift(key);
      this.trim();
    }
    trim() {
      for (const key of this.keys.splice(this.size)) {
        delete this.snapshots[key];
      }
    }
  };
  var PageView = class extends View {
    constructor() {
      super(...arguments);
      this.snapshotCache = new SnapshotCache(10);
      this.lastRenderedLocation = new URL(location.href);
    }
    renderPage(snapshot, isPreview = false) {
      const renderer = new PageRenderer(this.snapshot, snapshot, isPreview);
      return this.render(renderer);
    }
    renderError(snapshot) {
      const renderer = new ErrorRenderer(this.snapshot, snapshot, false);
      return this.render(renderer);
    }
    clearSnapshotCache() {
      this.snapshotCache.clear();
    }
    async cacheSnapshot() {
      if (this.shouldCacheSnapshot) {
        this.delegate.viewWillCacheSnapshot();
        const { snapshot, lastRenderedLocation: location2 } = this;
        await nextEventLoopTick();
        this.snapshotCache.put(location2, snapshot.clone());
      }
    }
    getCachedSnapshotForLocation(location2) {
      return this.snapshotCache.get(location2);
    }
    get snapshot() {
      return PageSnapshot.fromElement(this.element);
    }
    get shouldCacheSnapshot() {
      return this.snapshot.isCacheable;
    }
  };
  var Session = class {
    constructor() {
      this.navigator = new Navigator(this);
      this.history = new History(this);
      this.view = new PageView(this, document.documentElement);
      this.adapter = new BrowserAdapter(this);
      this.pageObserver = new PageObserver(this);
      this.cacheObserver = new CacheObserver();
      this.linkClickObserver = new LinkClickObserver(this);
      this.formSubmitObserver = new FormSubmitObserver(this);
      this.scrollObserver = new ScrollObserver(this);
      this.streamObserver = new StreamObserver(this);
      this.frameRedirector = new FrameRedirector(document.documentElement);
      this.drive = true;
      this.enabled = true;
      this.progressBarDelay = 500;
      this.started = false;
    }
    start() {
      if (!this.started) {
        this.pageObserver.start();
        this.cacheObserver.start();
        this.linkClickObserver.start();
        this.formSubmitObserver.start();
        this.scrollObserver.start();
        this.streamObserver.start();
        this.frameRedirector.start();
        this.history.start();
        this.started = true;
        this.enabled = true;
      }
    }
    disable() {
      this.enabled = false;
    }
    stop() {
      if (this.started) {
        this.pageObserver.stop();
        this.cacheObserver.stop();
        this.linkClickObserver.stop();
        this.formSubmitObserver.stop();
        this.scrollObserver.stop();
        this.streamObserver.stop();
        this.frameRedirector.stop();
        this.history.stop();
        this.started = false;
      }
    }
    registerAdapter(adapter) {
      this.adapter = adapter;
    }
    visit(location2, options = {}) {
      this.navigator.proposeVisit(expandURL(location2), options);
    }
    connectStreamSource(source) {
      this.streamObserver.connectStreamSource(source);
    }
    disconnectStreamSource(source) {
      this.streamObserver.disconnectStreamSource(source);
    }
    renderStreamMessage(message) {
      document.documentElement.appendChild(StreamMessage.wrap(message).fragment);
    }
    clearCache() {
      this.view.clearSnapshotCache();
    }
    setProgressBarDelay(delay) {
      this.progressBarDelay = delay;
    }
    get location() {
      return this.history.location;
    }
    get restorationIdentifier() {
      return this.history.restorationIdentifier;
    }
    historyPoppedToLocationWithRestorationIdentifier(location2, restorationIdentifier) {
      if (this.enabled) {
        this.navigator.startVisit(location2, restorationIdentifier, { action: "restore", historyChanged: true });
      } else {
        this.adapter.pageInvalidated();
      }
    }
    scrollPositionChanged(position) {
      this.history.updateRestorationData({ scrollPosition: position });
    }
    willFollowLinkToLocation(link, location2) {
      return this.elementDriveEnabled(link) && this.locationIsVisitable(location2) && this.applicationAllowsFollowingLinkToLocation(link, location2);
    }
    followedLinkToLocation(link, location2) {
      const action = this.getActionForLink(link);
      this.convertLinkWithMethodClickToFormSubmission(link) || this.visit(location2.href, { action });
    }
    convertLinkWithMethodClickToFormSubmission(link) {
      var _a;
      const linkMethod = link.getAttribute("data-turbo-method");
      if (linkMethod) {
        const form = document.createElement("form");
        form.method = linkMethod;
        form.action = link.getAttribute("href") || "undefined";
        form.hidden = true;
        (_a = link.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(form, link);
        return dispatch("submit", { cancelable: true, target: form });
      } else {
        return false;
      }
    }
    allowsVisitingLocationWithAction(location2, action) {
      return this.locationWithActionIsSamePage(location2, action) || this.applicationAllowsVisitingLocation(location2);
    }
    visitProposedToLocation(location2, options) {
      extendURLWithDeprecatedProperties(location2);
      this.adapter.visitProposedToLocation(location2, options);
    }
    visitStarted(visit2) {
      extendURLWithDeprecatedProperties(visit2.location);
      if (!visit2.silent) {
        this.notifyApplicationAfterVisitingLocation(visit2.location, visit2.action);
      }
    }
    visitCompleted(visit2) {
      this.notifyApplicationAfterPageLoad(visit2.getTimingMetrics());
    }
    locationWithActionIsSamePage(location2, action) {
      return this.navigator.locationWithActionIsSamePage(location2, action);
    }
    visitScrolledToSamePageLocation(oldURL, newURL) {
      this.notifyApplicationAfterVisitingSamePageLocation(oldURL, newURL);
    }
    willSubmitForm(form, submitter) {
      return this.elementDriveEnabled(form) && (!submitter || this.elementDriveEnabled(submitter));
    }
    formSubmitted(form, submitter) {
      this.navigator.submitForm(form, submitter);
    }
    pageBecameInteractive() {
      this.view.lastRenderedLocation = this.location;
      this.notifyApplicationAfterPageLoad();
    }
    pageLoaded() {
      this.history.assumeControlOfScrollRestoration();
    }
    pageWillUnload() {
      this.history.relinquishControlOfScrollRestoration();
    }
    receivedMessageFromStream(message) {
      this.renderStreamMessage(message);
    }
    viewWillCacheSnapshot() {
      var _a;
      if (!((_a = this.navigator.currentVisit) === null || _a === void 0 ? void 0 : _a.silent)) {
        this.notifyApplicationBeforeCachingSnapshot();
      }
    }
    allowsImmediateRender({ element }, resume) {
      const event = this.notifyApplicationBeforeRender(element, resume);
      return !event.defaultPrevented;
    }
    viewRenderedSnapshot(snapshot, isPreview) {
      this.view.lastRenderedLocation = this.history.location;
      this.notifyApplicationAfterRender();
    }
    viewInvalidated() {
      this.adapter.pageInvalidated();
    }
    frameLoaded(frame) {
      this.notifyApplicationAfterFrameLoad(frame);
    }
    frameRendered(fetchResponse, frame) {
      this.notifyApplicationAfterFrameRender(fetchResponse, frame);
    }
    applicationAllowsFollowingLinkToLocation(link, location2) {
      const event = this.notifyApplicationAfterClickingLinkToLocation(link, location2);
      return !event.defaultPrevented;
    }
    applicationAllowsVisitingLocation(location2) {
      const event = this.notifyApplicationBeforeVisitingLocation(location2);
      return !event.defaultPrevented;
    }
    notifyApplicationAfterClickingLinkToLocation(link, location2) {
      return dispatch("turbo:click", { target: link, detail: { url: location2.href }, cancelable: true });
    }
    notifyApplicationBeforeVisitingLocation(location2) {
      return dispatch("turbo:before-visit", { detail: { url: location2.href }, cancelable: true });
    }
    notifyApplicationAfterVisitingLocation(location2, action) {
      return dispatch("turbo:visit", { detail: { url: location2.href, action } });
    }
    notifyApplicationBeforeCachingSnapshot() {
      return dispatch("turbo:before-cache");
    }
    notifyApplicationBeforeRender(newBody, resume) {
      return dispatch("turbo:before-render", { detail: { newBody, resume }, cancelable: true });
    }
    notifyApplicationAfterRender() {
      return dispatch("turbo:render");
    }
    notifyApplicationAfterPageLoad(timing = {}) {
      return dispatch("turbo:load", { detail: { url: this.location.href, timing } });
    }
    notifyApplicationAfterVisitingSamePageLocation(oldURL, newURL) {
      dispatchEvent(new HashChangeEvent("hashchange", { oldURL: oldURL.toString(), newURL: newURL.toString() }));
    }
    notifyApplicationAfterFrameLoad(frame) {
      return dispatch("turbo:frame-load", { target: frame });
    }
    notifyApplicationAfterFrameRender(fetchResponse, frame) {
      return dispatch("turbo:frame-render", { detail: { fetchResponse }, target: frame, cancelable: true });
    }
    elementDriveEnabled(element) {
      const container = element === null || element === void 0 ? void 0 : element.closest("[data-turbo]");
      if (this.drive) {
        if (container) {
          return container.getAttribute("data-turbo") != "false";
        } else {
          return true;
        }
      } else {
        if (container) {
          return container.getAttribute("data-turbo") == "true";
        } else {
          return false;
        }
      }
    }
    getActionForLink(link) {
      const action = link.getAttribute("data-turbo-action");
      return isAction(action) ? action : "advance";
    }
    locationIsVisitable(location2) {
      return isPrefixedBy(location2, this.snapshot.rootLocation) && isHTML(location2);
    }
    get snapshot() {
      return this.view.snapshot;
    }
  };
  function extendURLWithDeprecatedProperties(url2) {
    Object.defineProperties(url2, deprecatedLocationPropertyDescriptors);
  }
  var deprecatedLocationPropertyDescriptors = {
    absoluteURL: {
      get() {
        return this.toString();
      }
    }
  };
  var session = new Session();
  var { navigator: navigator$1 } = session;
  function start() {
    session.start();
  }
  function registerAdapter(adapter) {
    session.registerAdapter(adapter);
  }
  function visit(location2, options) {
    session.visit(location2, options);
  }
  function connectStreamSource(source) {
    session.connectStreamSource(source);
  }
  function disconnectStreamSource(source) {
    session.disconnectStreamSource(source);
  }
  function renderStreamMessage(message) {
    session.renderStreamMessage(message);
  }
  function clearCache() {
    session.clearCache();
  }
  function setProgressBarDelay(delay) {
    session.setProgressBarDelay(delay);
  }
  var Turbo = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    navigator: navigator$1,
    session,
    PageRenderer,
    PageSnapshot,
    start,
    registerAdapter,
    visit,
    connectStreamSource,
    disconnectStreamSource,
    renderStreamMessage,
    clearCache,
    setProgressBarDelay
  });
  var FrameController = class {
    constructor(element) {
      this.resolveVisitPromise = () => {
      };
      this.connected = false;
      this.hasBeenLoaded = false;
      this.settingSourceURL = false;
      this.element = element;
      this.view = new FrameView(this, this.element);
      this.appearanceObserver = new AppearanceObserver(this, this.element);
      this.linkInterceptor = new LinkInterceptor(this, this.element);
      this.formInterceptor = new FormInterceptor(this, this.element);
    }
    connect() {
      if (!this.connected) {
        this.connected = true;
        this.reloadable = false;
        if (this.loadingStyle == FrameLoadingStyle.lazy) {
          this.appearanceObserver.start();
        }
        this.linkInterceptor.start();
        this.formInterceptor.start();
        this.sourceURLChanged();
      }
    }
    disconnect() {
      if (this.connected) {
        this.connected = false;
        this.appearanceObserver.stop();
        this.linkInterceptor.stop();
        this.formInterceptor.stop();
      }
    }
    disabledChanged() {
      if (this.loadingStyle == FrameLoadingStyle.eager) {
        this.loadSourceURL();
      }
    }
    sourceURLChanged() {
      if (this.loadingStyle == FrameLoadingStyle.eager || this.hasBeenLoaded) {
        this.loadSourceURL();
      }
    }
    loadingStyleChanged() {
      if (this.loadingStyle == FrameLoadingStyle.lazy) {
        this.appearanceObserver.start();
      } else {
        this.appearanceObserver.stop();
        this.loadSourceURL();
      }
    }
    async loadSourceURL() {
      if (!this.settingSourceURL && this.enabled && this.isActive && (this.reloadable || this.sourceURL != this.currentURL)) {
        const previousURL = this.currentURL;
        this.currentURL = this.sourceURL;
        if (this.sourceURL) {
          try {
            this.element.loaded = this.visit(this.sourceURL);
            this.appearanceObserver.stop();
            await this.element.loaded;
            this.hasBeenLoaded = true;
            session.frameLoaded(this.element);
          } catch (error4) {
            this.currentURL = previousURL;
            throw error4;
          }
        }
      }
    }
    async loadResponse(fetchResponse) {
      if (fetchResponse.redirected) {
        this.sourceURL = fetchResponse.response.url;
      }
      try {
        const html = await fetchResponse.responseHTML;
        if (html) {
          const { body } = parseHTMLDocument(html);
          const snapshot = new Snapshot(await this.extractForeignFrameElement(body));
          const renderer = new FrameRenderer(this.view.snapshot, snapshot, false);
          if (this.view.renderPromise)
            await this.view.renderPromise;
          await this.view.render(renderer);
          session.frameRendered(fetchResponse, this.element);
        }
      } catch (error4) {
        console.error(error4);
        this.view.invalidate();
      }
    }
    elementAppearedInViewport(element) {
      this.loadSourceURL();
    }
    shouldInterceptLinkClick(element, url2) {
      if (element.hasAttribute("data-turbo-method")) {
        return false;
      } else {
        return this.shouldInterceptNavigation(element);
      }
    }
    linkClickIntercepted(element, url2) {
      this.reloadable = true;
      this.navigateFrame(element, url2);
    }
    shouldInterceptFormSubmission(element, submitter) {
      return this.shouldInterceptNavigation(element, submitter);
    }
    formSubmissionIntercepted(element, submitter) {
      if (this.formSubmission) {
        this.formSubmission.stop();
      }
      this.reloadable = false;
      this.formSubmission = new FormSubmission(this, element, submitter);
      if (this.formSubmission.fetchRequest.isIdempotent) {
        this.navigateFrame(element, this.formSubmission.fetchRequest.url.href, submitter);
      } else {
        const { fetchRequest } = this.formSubmission;
        this.prepareHeadersForRequest(fetchRequest.headers, fetchRequest);
        this.formSubmission.start();
      }
    }
    prepareHeadersForRequest(headers, request2) {
      headers["Turbo-Frame"] = this.id;
    }
    requestStarted(request2) {
      this.element.setAttribute("busy", "");
    }
    requestPreventedHandlingResponse(request2, response) {
      this.resolveVisitPromise();
    }
    async requestSucceededWithResponse(request2, response) {
      await this.loadResponse(response);
      this.resolveVisitPromise();
    }
    requestFailedWithResponse(request2, response) {
      console.error(response);
      this.resolveVisitPromise();
    }
    requestErrored(request2, error4) {
      console.error(error4);
      this.resolveVisitPromise();
    }
    requestFinished(request2) {
      this.element.removeAttribute("busy");
    }
    formSubmissionStarted(formSubmission) {
      const frame = this.findFrameElement(formSubmission.formElement);
      frame.setAttribute("busy", "");
    }
    formSubmissionSucceededWithResponse(formSubmission, response) {
      const frame = this.findFrameElement(formSubmission.formElement, formSubmission.submitter);
      frame.delegate.loadResponse(response);
    }
    formSubmissionFailedWithResponse(formSubmission, fetchResponse) {
      this.element.delegate.loadResponse(fetchResponse);
    }
    formSubmissionErrored(formSubmission, error4) {
      console.error(error4);
    }
    formSubmissionFinished(formSubmission) {
      const frame = this.findFrameElement(formSubmission.formElement);
      frame.removeAttribute("busy");
    }
    allowsImmediateRender(snapshot, resume) {
      return true;
    }
    viewRenderedSnapshot(snapshot, isPreview) {
    }
    viewInvalidated() {
    }
    async visit(url2) {
      const request2 = new FetchRequest(this, FetchMethod.get, expandURL(url2), void 0, this.element);
      return new Promise((resolve) => {
        this.resolveVisitPromise = () => {
          this.resolveVisitPromise = () => {
          };
          resolve();
        };
        request2.perform();
      });
    }
    navigateFrame(element, url2, submitter) {
      const frame = this.findFrameElement(element, submitter);
      frame.setAttribute("reloadable", "");
      frame.src = url2;
    }
    findFrameElement(element, submitter) {
      var _a;
      const id = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("data-turbo-frame")) || element.getAttribute("data-turbo-frame") || this.element.getAttribute("target");
      return (_a = getFrameElementById(id)) !== null && _a !== void 0 ? _a : this.element;
    }
    async extractForeignFrameElement(container) {
      let element;
      const id = CSS.escape(this.id);
      try {
        if (element = activateElement(container.querySelector(`turbo-frame#${id}`), this.currentURL)) {
          return element;
        }
        if (element = activateElement(container.querySelector(`turbo-frame[src][recurse~=${id}]`), this.currentURL)) {
          await element.loaded;
          return await this.extractForeignFrameElement(element);
        }
        console.error(`Response has no matching <turbo-frame id="${id}"> element`);
      } catch (error4) {
        console.error(error4);
      }
      return new FrameElement();
    }
    shouldInterceptNavigation(element, submitter) {
      const id = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("data-turbo-frame")) || element.getAttribute("data-turbo-frame") || this.element.getAttribute("target");
      if (!this.enabled || id == "_top") {
        return false;
      }
      if (id) {
        const frameElement = getFrameElementById(id);
        if (frameElement) {
          return !frameElement.disabled;
        }
      }
      if (!session.elementDriveEnabled(element)) {
        return false;
      }
      if (submitter && !session.elementDriveEnabled(submitter)) {
        return false;
      }
      return true;
    }
    get id() {
      return this.element.id;
    }
    get enabled() {
      return !this.element.disabled;
    }
    get sourceURL() {
      if (this.element.src) {
        return this.element.src;
      }
    }
    get reloadable() {
      const frame = this.findFrameElement(this.element);
      return frame.hasAttribute("reloadable");
    }
    set reloadable(value) {
      const frame = this.findFrameElement(this.element);
      if (value) {
        frame.setAttribute("reloadable", "");
      } else {
        frame.removeAttribute("reloadable");
      }
    }
    set sourceURL(sourceURL) {
      this.settingSourceURL = true;
      this.element.src = sourceURL !== null && sourceURL !== void 0 ? sourceURL : null;
      this.currentURL = this.element.src;
      this.settingSourceURL = false;
    }
    get loadingStyle() {
      return this.element.loading;
    }
    get isLoading() {
      return this.formSubmission !== void 0 || this.resolveVisitPromise() !== void 0;
    }
    get isActive() {
      return this.element.isActive && this.connected;
    }
  };
  function getFrameElementById(id) {
    if (id != null) {
      const element = document.getElementById(id);
      if (element instanceof FrameElement) {
        return element;
      }
    }
  }
  function activateElement(element, currentURL) {
    if (element) {
      const src = element.getAttribute("src");
      if (src != null && currentURL != null && urlsAreEqual(src, currentURL)) {
        throw new Error(`Matching <turbo-frame id="${element.id}"> element has a source URL which references itself`);
      }
      if (element.ownerDocument !== document) {
        element = document.importNode(element, true);
      }
      if (element instanceof FrameElement) {
        element.connectedCallback();
        return element;
      }
    }
  }
  var StreamActions = {
    after() {
      this.targetElements.forEach((e2) => {
        var _a;
        return (_a = e2.parentElement) === null || _a === void 0 ? void 0 : _a.insertBefore(this.templateContent, e2.nextSibling);
      });
    },
    append() {
      this.removeDuplicateTargetChildren();
      this.targetElements.forEach((e2) => e2.append(this.templateContent));
    },
    before() {
      this.targetElements.forEach((e2) => {
        var _a;
        return (_a = e2.parentElement) === null || _a === void 0 ? void 0 : _a.insertBefore(this.templateContent, e2);
      });
    },
    prepend() {
      this.removeDuplicateTargetChildren();
      this.targetElements.forEach((e2) => e2.prepend(this.templateContent));
    },
    remove() {
      this.targetElements.forEach((e2) => e2.remove());
    },
    replace() {
      this.targetElements.forEach((e2) => e2.replaceWith(this.templateContent));
    },
    update() {
      this.targetElements.forEach((e2) => {
        e2.innerHTML = "";
        e2.append(this.templateContent);
      });
    }
  };
  var StreamElement = class extends HTMLElement {
    async connectedCallback() {
      try {
        await this.render();
      } catch (error4) {
        console.error(error4);
      } finally {
        this.disconnect();
      }
    }
    async render() {
      var _a;
      return (_a = this.renderPromise) !== null && _a !== void 0 ? _a : this.renderPromise = (async () => {
        if (this.dispatchEvent(this.beforeRenderEvent)) {
          await nextAnimationFrame();
          this.performAction();
        }
      })();
    }
    disconnect() {
      try {
        this.remove();
      } catch (_a) {
      }
    }
    removeDuplicateTargetChildren() {
      this.duplicateChildren.forEach((c) => c.remove());
    }
    get duplicateChildren() {
      var _a;
      const existingChildren = this.targetElements.flatMap((e2) => [...e2.children]).filter((c) => !!c.id);
      const newChildrenIds = [...(_a = this.templateContent) === null || _a === void 0 ? void 0 : _a.children].filter((c) => !!c.id).map((c) => c.id);
      return existingChildren.filter((c) => newChildrenIds.includes(c.id));
    }
    get performAction() {
      if (this.action) {
        const actionFunction = StreamActions[this.action];
        if (actionFunction) {
          return actionFunction;
        }
        this.raise("unknown action");
      }
      this.raise("action attribute is missing");
    }
    get targetElements() {
      if (this.target) {
        return this.targetElementsById;
      } else if (this.targets) {
        return this.targetElementsByQuery;
      } else {
        this.raise("target or targets attribute is missing");
      }
    }
    get templateContent() {
      return this.templateElement.content.cloneNode(true);
    }
    get templateElement() {
      if (this.firstElementChild instanceof HTMLTemplateElement) {
        return this.firstElementChild;
      }
      this.raise("first child element must be a <template> element");
    }
    get action() {
      return this.getAttribute("action");
    }
    get target() {
      return this.getAttribute("target");
    }
    get targets() {
      return this.getAttribute("targets");
    }
    raise(message) {
      throw new Error(`${this.description}: ${message}`);
    }
    get description() {
      var _a, _b;
      return (_b = ((_a = this.outerHTML.match(/<[^>]+>/)) !== null && _a !== void 0 ? _a : [])[0]) !== null && _b !== void 0 ? _b : "<turbo-stream>";
    }
    get beforeRenderEvent() {
      return new CustomEvent("turbo:before-stream-render", { bubbles: true, cancelable: true });
    }
    get targetElementsById() {
      var _a;
      const element = (_a = this.ownerDocument) === null || _a === void 0 ? void 0 : _a.getElementById(this.target);
      if (element !== null) {
        return [element];
      } else {
        return [];
      }
    }
    get targetElementsByQuery() {
      var _a;
      const elements = (_a = this.ownerDocument) === null || _a === void 0 ? void 0 : _a.querySelectorAll(this.targets);
      if (elements.length !== 0) {
        return Array.prototype.slice.call(elements);
      } else {
        return [];
      }
    }
  };
  FrameElement.delegateConstructor = FrameController;
  customElements.define("turbo-frame", FrameElement);
  customElements.define("turbo-stream", StreamElement);
  (() => {
    let element = document.currentScript;
    if (!element)
      return;
    if (element.hasAttribute("data-turbo-suppress-warning"))
      return;
    while (element = element.parentElement) {
      if (element == document.body) {
        return console.warn(unindent`
        You are loading Turbo from a <script> element inside the <body> element. This is probably not what you meant to do!

        Load your application’s JavaScript bundle inside the <head> element instead. <script> elements in <body> are evaluated with each page change.

        For more information, see: https://turbo.hotwired.dev/handbook/building#working-with-script-elements

        ——
        Suppress this warning by adding a "data-turbo-suppress-warning" attribute to: %s
      `, element.outerHTML);
      }
    }
  })();
  window.Turbo = Turbo;
  start();

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/cable.js
  var consumer;
  async function getConsumer() {
    return consumer || setConsumer(createConsumer2().then(setConsumer));
  }
  function setConsumer(newConsumer) {
    return consumer = newConsumer;
  }
  async function createConsumer2() {
    const { createConsumer: createConsumer5 } = await Promise.resolve().then(() => (init_src(), src_exports));
    return createConsumer5();
  }
  async function subscribeTo(channel, mixin) {
    const { subscriptions } = await getConsumer();
    return subscriptions.create(channel, mixin);
  }

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/cable_stream_source_element.js
  var TurboCableStreamSourceElement = class extends HTMLElement {
    async connectedCallback() {
      connectStreamSource(this);
      this.subscription = await subscribeTo(this.channel, { received: this.dispatchMessageEvent.bind(this) });
    }
    disconnectedCallback() {
      disconnectStreamSource(this);
      if (this.subscription)
        this.subscription.unsubscribe();
    }
    dispatchMessageEvent(data) {
      const event = new MessageEvent("message", { data });
      return this.dispatchEvent(event);
    }
    get channel() {
      const channel = this.getAttribute("channel");
      const signed_stream_name = this.getAttribute("signed-stream-name");
      return { channel, signed_stream_name };
    }
  };
  customElements.define("turbo-cable-stream-source", TurboCableStreamSourceElement);

  // app/javascript/application.js
  var ActiveStorage = __toModule(require_activestorage());

  // node_modules/@hotwired/stimulus/dist/stimulus.js
  var EventListener = class {
    constructor(eventTarget, eventName, eventOptions) {
      this.eventTarget = eventTarget;
      this.eventName = eventName;
      this.eventOptions = eventOptions;
      this.unorderedBindings = new Set();
    }
    connect() {
      this.eventTarget.addEventListener(this.eventName, this, this.eventOptions);
    }
    disconnect() {
      this.eventTarget.removeEventListener(this.eventName, this, this.eventOptions);
    }
    bindingConnected(binding) {
      this.unorderedBindings.add(binding);
    }
    bindingDisconnected(binding) {
      this.unorderedBindings.delete(binding);
    }
    handleEvent(event) {
      const extendedEvent = extendEvent(event);
      for (const binding of this.bindings) {
        if (extendedEvent.immediatePropagationStopped) {
          break;
        } else {
          binding.handleEvent(extendedEvent);
        }
      }
    }
    get bindings() {
      return Array.from(this.unorderedBindings).sort((left, right) => {
        const leftIndex = left.index, rightIndex = right.index;
        return leftIndex < rightIndex ? -1 : leftIndex > rightIndex ? 1 : 0;
      });
    }
  };
  function extendEvent(event) {
    if ("immediatePropagationStopped" in event) {
      return event;
    } else {
      const { stopImmediatePropagation } = event;
      return Object.assign(event, {
        immediatePropagationStopped: false,
        stopImmediatePropagation() {
          this.immediatePropagationStopped = true;
          stopImmediatePropagation.call(this);
        }
      });
    }
  }
  var Dispatcher = class {
    constructor(application2) {
      this.application = application2;
      this.eventListenerMaps = new Map();
      this.started = false;
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.eventListeners.forEach((eventListener) => eventListener.connect());
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        this.eventListeners.forEach((eventListener) => eventListener.disconnect());
      }
    }
    get eventListeners() {
      return Array.from(this.eventListenerMaps.values()).reduce((listeners, map) => listeners.concat(Array.from(map.values())), []);
    }
    bindingConnected(binding) {
      this.fetchEventListenerForBinding(binding).bindingConnected(binding);
    }
    bindingDisconnected(binding) {
      this.fetchEventListenerForBinding(binding).bindingDisconnected(binding);
    }
    handleError(error4, message, detail = {}) {
      this.application.handleError(error4, `Error ${message}`, detail);
    }
    fetchEventListenerForBinding(binding) {
      const { eventTarget, eventName, eventOptions } = binding;
      return this.fetchEventListener(eventTarget, eventName, eventOptions);
    }
    fetchEventListener(eventTarget, eventName, eventOptions) {
      const eventListenerMap = this.fetchEventListenerMapForEventTarget(eventTarget);
      const cacheKey = this.cacheKey(eventName, eventOptions);
      let eventListener = eventListenerMap.get(cacheKey);
      if (!eventListener) {
        eventListener = this.createEventListener(eventTarget, eventName, eventOptions);
        eventListenerMap.set(cacheKey, eventListener);
      }
      return eventListener;
    }
    createEventListener(eventTarget, eventName, eventOptions) {
      const eventListener = new EventListener(eventTarget, eventName, eventOptions);
      if (this.started) {
        eventListener.connect();
      }
      return eventListener;
    }
    fetchEventListenerMapForEventTarget(eventTarget) {
      let eventListenerMap = this.eventListenerMaps.get(eventTarget);
      if (!eventListenerMap) {
        eventListenerMap = new Map();
        this.eventListenerMaps.set(eventTarget, eventListenerMap);
      }
      return eventListenerMap;
    }
    cacheKey(eventName, eventOptions) {
      const parts = [eventName];
      Object.keys(eventOptions).sort().forEach((key) => {
        parts.push(`${eventOptions[key] ? "" : "!"}${key}`);
      });
      return parts.join(":");
    }
  };
  var descriptorPattern = /^((.+?)(@(window|document))?->)?(.+?)(#([^:]+?))(:(.+))?$/;
  function parseActionDescriptorString(descriptorString) {
    const source = descriptorString.trim();
    const matches = source.match(descriptorPattern) || [];
    return {
      eventTarget: parseEventTarget(matches[4]),
      eventName: matches[2],
      eventOptions: matches[9] ? parseEventOptions(matches[9]) : {},
      identifier: matches[5],
      methodName: matches[7]
    };
  }
  function parseEventTarget(eventTargetName) {
    if (eventTargetName == "window") {
      return window;
    } else if (eventTargetName == "document") {
      return document;
    }
  }
  function parseEventOptions(eventOptions) {
    return eventOptions.split(":").reduce((options, token) => Object.assign(options, { [token.replace(/^!/, "")]: !/^!/.test(token) }), {});
  }
  function stringifyEventTarget(eventTarget) {
    if (eventTarget == window) {
      return "window";
    } else if (eventTarget == document) {
      return "document";
    }
  }
  function camelize(value) {
    return value.replace(/(?:[_-])([a-z0-9])/g, (_, char) => char.toUpperCase());
  }
  function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  function dasherize(value) {
    return value.replace(/([A-Z])/g, (_, char) => `-${char.toLowerCase()}`);
  }
  function tokenize(value) {
    return value.match(/[^\s]+/g) || [];
  }
  var Action = class {
    constructor(element, index, descriptor) {
      this.element = element;
      this.index = index;
      this.eventTarget = descriptor.eventTarget || element;
      this.eventName = descriptor.eventName || getDefaultEventNameForElement(element) || error("missing event name");
      this.eventOptions = descriptor.eventOptions || {};
      this.identifier = descriptor.identifier || error("missing identifier");
      this.methodName = descriptor.methodName || error("missing method name");
    }
    static forToken(token) {
      return new this(token.element, token.index, parseActionDescriptorString(token.content));
    }
    toString() {
      const eventNameSuffix = this.eventTargetName ? `@${this.eventTargetName}` : "";
      return `${this.eventName}${eventNameSuffix}->${this.identifier}#${this.methodName}`;
    }
    get params() {
      if (this.eventTarget instanceof Element) {
        return this.getParamsFromEventTargetAttributes(this.eventTarget);
      } else {
        return {};
      }
    }
    getParamsFromEventTargetAttributes(eventTarget) {
      const params2 = {};
      const pattern = new RegExp(`^data-${this.identifier}-(.+)-param$`);
      const attributes = Array.from(eventTarget.attributes);
      attributes.forEach(({ name, value }) => {
        const match = name.match(pattern);
        const key = match && match[1];
        if (key) {
          Object.assign(params2, { [camelize(key)]: typecast(value) });
        }
      });
      return params2;
    }
    get eventTargetName() {
      return stringifyEventTarget(this.eventTarget);
    }
  };
  var defaultEventNames = {
    "a": (e2) => "click",
    "button": (e2) => "click",
    "form": (e2) => "submit",
    "details": (e2) => "toggle",
    "input": (e2) => e2.getAttribute("type") == "submit" ? "click" : "input",
    "select": (e2) => "change",
    "textarea": (e2) => "input"
  };
  function getDefaultEventNameForElement(element) {
    const tagName = element.tagName.toLowerCase();
    if (tagName in defaultEventNames) {
      return defaultEventNames[tagName](element);
    }
  }
  function error(message) {
    throw new Error(message);
  }
  function typecast(value) {
    try {
      return JSON.parse(value);
    } catch (o_O) {
      return value;
    }
  }
  var Binding = class {
    constructor(context, action) {
      this.context = context;
      this.action = action;
    }
    get index() {
      return this.action.index;
    }
    get eventTarget() {
      return this.action.eventTarget;
    }
    get eventOptions() {
      return this.action.eventOptions;
    }
    get identifier() {
      return this.context.identifier;
    }
    handleEvent(event) {
      if (this.willBeInvokedByEvent(event)) {
        this.invokeWithEvent(event);
      }
    }
    get eventName() {
      return this.action.eventName;
    }
    get method() {
      const method = this.controller[this.methodName];
      if (typeof method == "function") {
        return method;
      }
      throw new Error(`Action "${this.action}" references undefined method "${this.methodName}"`);
    }
    invokeWithEvent(event) {
      const { target, currentTarget } = event;
      try {
        const { params: params2 } = this.action;
        const actionEvent = Object.assign(event, { params: params2 });
        this.method.call(this.controller, actionEvent);
        this.context.logDebugActivity(this.methodName, { event, target, currentTarget, action: this.methodName });
      } catch (error4) {
        const { identifier, controller, element, index } = this;
        const detail = { identifier, controller, element, index, event };
        this.context.handleError(error4, `invoking action "${this.action}"`, detail);
      }
    }
    willBeInvokedByEvent(event) {
      const eventTarget = event.target;
      if (this.element === eventTarget) {
        return true;
      } else if (eventTarget instanceof Element && this.element.contains(eventTarget)) {
        return this.scope.containsElement(eventTarget);
      } else {
        return this.scope.containsElement(this.action.element);
      }
    }
    get controller() {
      return this.context.controller;
    }
    get methodName() {
      return this.action.methodName;
    }
    get element() {
      return this.scope.element;
    }
    get scope() {
      return this.context.scope;
    }
  };
  var ElementObserver = class {
    constructor(element, delegate) {
      this.mutationObserverInit = { attributes: true, childList: true, subtree: true };
      this.element = element;
      this.started = false;
      this.delegate = delegate;
      this.elements = new Set();
      this.mutationObserver = new MutationObserver((mutations) => this.processMutations(mutations));
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.mutationObserver.observe(this.element, this.mutationObserverInit);
        this.refresh();
      }
    }
    pause(callback) {
      if (this.started) {
        this.mutationObserver.disconnect();
        this.started = false;
      }
      callback();
      if (!this.started) {
        this.mutationObserver.observe(this.element, this.mutationObserverInit);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        this.mutationObserver.takeRecords();
        this.mutationObserver.disconnect();
        this.started = false;
      }
    }
    refresh() {
      if (this.started) {
        const matches = new Set(this.matchElementsInTree());
        for (const element of Array.from(this.elements)) {
          if (!matches.has(element)) {
            this.removeElement(element);
          }
        }
        for (const element of Array.from(matches)) {
          this.addElement(element);
        }
      }
    }
    processMutations(mutations) {
      if (this.started) {
        for (const mutation of mutations) {
          this.processMutation(mutation);
        }
      }
    }
    processMutation(mutation) {
      if (mutation.type == "attributes") {
        this.processAttributeChange(mutation.target, mutation.attributeName);
      } else if (mutation.type == "childList") {
        this.processRemovedNodes(mutation.removedNodes);
        this.processAddedNodes(mutation.addedNodes);
      }
    }
    processAttributeChange(node, attributeName) {
      const element = node;
      if (this.elements.has(element)) {
        if (this.delegate.elementAttributeChanged && this.matchElement(element)) {
          this.delegate.elementAttributeChanged(element, attributeName);
        } else {
          this.removeElement(element);
        }
      } else if (this.matchElement(element)) {
        this.addElement(element);
      }
    }
    processRemovedNodes(nodes) {
      for (const node of Array.from(nodes)) {
        const element = this.elementFromNode(node);
        if (element) {
          this.processTree(element, this.removeElement);
        }
      }
    }
    processAddedNodes(nodes) {
      for (const node of Array.from(nodes)) {
        const element = this.elementFromNode(node);
        if (element && this.elementIsActive(element)) {
          this.processTree(element, this.addElement);
        }
      }
    }
    matchElement(element) {
      return this.delegate.matchElement(element);
    }
    matchElementsInTree(tree = this.element) {
      return this.delegate.matchElementsInTree(tree);
    }
    processTree(tree, processor) {
      for (const element of this.matchElementsInTree(tree)) {
        processor.call(this, element);
      }
    }
    elementFromNode(node) {
      if (node.nodeType == Node.ELEMENT_NODE) {
        return node;
      }
    }
    elementIsActive(element) {
      if (element.isConnected != this.element.isConnected) {
        return false;
      } else {
        return this.element.contains(element);
      }
    }
    addElement(element) {
      if (!this.elements.has(element)) {
        if (this.elementIsActive(element)) {
          this.elements.add(element);
          if (this.delegate.elementMatched) {
            this.delegate.elementMatched(element);
          }
        }
      }
    }
    removeElement(element) {
      if (this.elements.has(element)) {
        this.elements.delete(element);
        if (this.delegate.elementUnmatched) {
          this.delegate.elementUnmatched(element);
        }
      }
    }
  };
  var AttributeObserver = class {
    constructor(element, attributeName, delegate) {
      this.attributeName = attributeName;
      this.delegate = delegate;
      this.elementObserver = new ElementObserver(element, this);
    }
    get element() {
      return this.elementObserver.element;
    }
    get selector() {
      return `[${this.attributeName}]`;
    }
    start() {
      this.elementObserver.start();
    }
    pause(callback) {
      this.elementObserver.pause(callback);
    }
    stop() {
      this.elementObserver.stop();
    }
    refresh() {
      this.elementObserver.refresh();
    }
    get started() {
      return this.elementObserver.started;
    }
    matchElement(element) {
      return element.hasAttribute(this.attributeName);
    }
    matchElementsInTree(tree) {
      const match = this.matchElement(tree) ? [tree] : [];
      const matches = Array.from(tree.querySelectorAll(this.selector));
      return match.concat(matches);
    }
    elementMatched(element) {
      if (this.delegate.elementMatchedAttribute) {
        this.delegate.elementMatchedAttribute(element, this.attributeName);
      }
    }
    elementUnmatched(element) {
      if (this.delegate.elementUnmatchedAttribute) {
        this.delegate.elementUnmatchedAttribute(element, this.attributeName);
      }
    }
    elementAttributeChanged(element, attributeName) {
      if (this.delegate.elementAttributeValueChanged && this.attributeName == attributeName) {
        this.delegate.elementAttributeValueChanged(element, attributeName);
      }
    }
  };
  var StringMapObserver = class {
    constructor(element, delegate) {
      this.element = element;
      this.delegate = delegate;
      this.started = false;
      this.stringMap = new Map();
      this.mutationObserver = new MutationObserver((mutations) => this.processMutations(mutations));
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.mutationObserver.observe(this.element, { attributes: true, attributeOldValue: true });
        this.refresh();
      }
    }
    stop() {
      if (this.started) {
        this.mutationObserver.takeRecords();
        this.mutationObserver.disconnect();
        this.started = false;
      }
    }
    refresh() {
      if (this.started) {
        for (const attributeName of this.knownAttributeNames) {
          this.refreshAttribute(attributeName, null);
        }
      }
    }
    processMutations(mutations) {
      if (this.started) {
        for (const mutation of mutations) {
          this.processMutation(mutation);
        }
      }
    }
    processMutation(mutation) {
      const attributeName = mutation.attributeName;
      if (attributeName) {
        this.refreshAttribute(attributeName, mutation.oldValue);
      }
    }
    refreshAttribute(attributeName, oldValue) {
      const key = this.delegate.getStringMapKeyForAttribute(attributeName);
      if (key != null) {
        if (!this.stringMap.has(attributeName)) {
          this.stringMapKeyAdded(key, attributeName);
        }
        const value = this.element.getAttribute(attributeName);
        if (this.stringMap.get(attributeName) != value) {
          this.stringMapValueChanged(value, key, oldValue);
        }
        if (value == null) {
          const oldValue2 = this.stringMap.get(attributeName);
          this.stringMap.delete(attributeName);
          if (oldValue2)
            this.stringMapKeyRemoved(key, attributeName, oldValue2);
        } else {
          this.stringMap.set(attributeName, value);
        }
      }
    }
    stringMapKeyAdded(key, attributeName) {
      if (this.delegate.stringMapKeyAdded) {
        this.delegate.stringMapKeyAdded(key, attributeName);
      }
    }
    stringMapValueChanged(value, key, oldValue) {
      if (this.delegate.stringMapValueChanged) {
        this.delegate.stringMapValueChanged(value, key, oldValue);
      }
    }
    stringMapKeyRemoved(key, attributeName, oldValue) {
      if (this.delegate.stringMapKeyRemoved) {
        this.delegate.stringMapKeyRemoved(key, attributeName, oldValue);
      }
    }
    get knownAttributeNames() {
      return Array.from(new Set(this.currentAttributeNames.concat(this.recordedAttributeNames)));
    }
    get currentAttributeNames() {
      return Array.from(this.element.attributes).map((attribute) => attribute.name);
    }
    get recordedAttributeNames() {
      return Array.from(this.stringMap.keys());
    }
  };
  function add(map, key, value) {
    fetch2(map, key).add(value);
  }
  function del(map, key, value) {
    fetch2(map, key).delete(value);
    prune(map, key);
  }
  function fetch2(map, key) {
    let values = map.get(key);
    if (!values) {
      values = new Set();
      map.set(key, values);
    }
    return values;
  }
  function prune(map, key) {
    const values = map.get(key);
    if (values != null && values.size == 0) {
      map.delete(key);
    }
  }
  var Multimap = class {
    constructor() {
      this.valuesByKey = new Map();
    }
    get keys() {
      return Array.from(this.valuesByKey.keys());
    }
    get values() {
      const sets = Array.from(this.valuesByKey.values());
      return sets.reduce((values, set) => values.concat(Array.from(set)), []);
    }
    get size() {
      const sets = Array.from(this.valuesByKey.values());
      return sets.reduce((size, set) => size + set.size, 0);
    }
    add(key, value) {
      add(this.valuesByKey, key, value);
    }
    delete(key, value) {
      del(this.valuesByKey, key, value);
    }
    has(key, value) {
      const values = this.valuesByKey.get(key);
      return values != null && values.has(value);
    }
    hasKey(key) {
      return this.valuesByKey.has(key);
    }
    hasValue(value) {
      const sets = Array.from(this.valuesByKey.values());
      return sets.some((set) => set.has(value));
    }
    getValuesForKey(key) {
      const values = this.valuesByKey.get(key);
      return values ? Array.from(values) : [];
    }
    getKeysForValue(value) {
      return Array.from(this.valuesByKey).filter(([key, values]) => values.has(value)).map(([key, values]) => key);
    }
  };
  var TokenListObserver = class {
    constructor(element, attributeName, delegate) {
      this.attributeObserver = new AttributeObserver(element, attributeName, this);
      this.delegate = delegate;
      this.tokensByElement = new Multimap();
    }
    get started() {
      return this.attributeObserver.started;
    }
    start() {
      this.attributeObserver.start();
    }
    pause(callback) {
      this.attributeObserver.pause(callback);
    }
    stop() {
      this.attributeObserver.stop();
    }
    refresh() {
      this.attributeObserver.refresh();
    }
    get element() {
      return this.attributeObserver.element;
    }
    get attributeName() {
      return this.attributeObserver.attributeName;
    }
    elementMatchedAttribute(element) {
      this.tokensMatched(this.readTokensForElement(element));
    }
    elementAttributeValueChanged(element) {
      const [unmatchedTokens, matchedTokens] = this.refreshTokensForElement(element);
      this.tokensUnmatched(unmatchedTokens);
      this.tokensMatched(matchedTokens);
    }
    elementUnmatchedAttribute(element) {
      this.tokensUnmatched(this.tokensByElement.getValuesForKey(element));
    }
    tokensMatched(tokens) {
      tokens.forEach((token) => this.tokenMatched(token));
    }
    tokensUnmatched(tokens) {
      tokens.forEach((token) => this.tokenUnmatched(token));
    }
    tokenMatched(token) {
      this.delegate.tokenMatched(token);
      this.tokensByElement.add(token.element, token);
    }
    tokenUnmatched(token) {
      this.delegate.tokenUnmatched(token);
      this.tokensByElement.delete(token.element, token);
    }
    refreshTokensForElement(element) {
      const previousTokens = this.tokensByElement.getValuesForKey(element);
      const currentTokens = this.readTokensForElement(element);
      const firstDifferingIndex = zip(previousTokens, currentTokens).findIndex(([previousToken, currentToken]) => !tokensAreEqual(previousToken, currentToken));
      if (firstDifferingIndex == -1) {
        return [[], []];
      } else {
        return [previousTokens.slice(firstDifferingIndex), currentTokens.slice(firstDifferingIndex)];
      }
    }
    readTokensForElement(element) {
      const attributeName = this.attributeName;
      const tokenString = element.getAttribute(attributeName) || "";
      return parseTokenString(tokenString, element, attributeName);
    }
  };
  function parseTokenString(tokenString, element, attributeName) {
    return tokenString.trim().split(/\s+/).filter((content) => content.length).map((content, index) => ({ element, attributeName, content, index }));
  }
  function zip(left, right) {
    const length = Math.max(left.length, right.length);
    return Array.from({ length }, (_, index) => [left[index], right[index]]);
  }
  function tokensAreEqual(left, right) {
    return left && right && left.index == right.index && left.content == right.content;
  }
  var ValueListObserver = class {
    constructor(element, attributeName, delegate) {
      this.tokenListObserver = new TokenListObserver(element, attributeName, this);
      this.delegate = delegate;
      this.parseResultsByToken = new WeakMap();
      this.valuesByTokenByElement = new WeakMap();
    }
    get started() {
      return this.tokenListObserver.started;
    }
    start() {
      this.tokenListObserver.start();
    }
    stop() {
      this.tokenListObserver.stop();
    }
    refresh() {
      this.tokenListObserver.refresh();
    }
    get element() {
      return this.tokenListObserver.element;
    }
    get attributeName() {
      return this.tokenListObserver.attributeName;
    }
    tokenMatched(token) {
      const { element } = token;
      const { value } = this.fetchParseResultForToken(token);
      if (value) {
        this.fetchValuesByTokenForElement(element).set(token, value);
        this.delegate.elementMatchedValue(element, value);
      }
    }
    tokenUnmatched(token) {
      const { element } = token;
      const { value } = this.fetchParseResultForToken(token);
      if (value) {
        this.fetchValuesByTokenForElement(element).delete(token);
        this.delegate.elementUnmatchedValue(element, value);
      }
    }
    fetchParseResultForToken(token) {
      let parseResult = this.parseResultsByToken.get(token);
      if (!parseResult) {
        parseResult = this.parseToken(token);
        this.parseResultsByToken.set(token, parseResult);
      }
      return parseResult;
    }
    fetchValuesByTokenForElement(element) {
      let valuesByToken = this.valuesByTokenByElement.get(element);
      if (!valuesByToken) {
        valuesByToken = new Map();
        this.valuesByTokenByElement.set(element, valuesByToken);
      }
      return valuesByToken;
    }
    parseToken(token) {
      try {
        const value = this.delegate.parseValueForToken(token);
        return { value };
      } catch (error4) {
        return { error: error4 };
      }
    }
  };
  var BindingObserver = class {
    constructor(context, delegate) {
      this.context = context;
      this.delegate = delegate;
      this.bindingsByAction = new Map();
    }
    start() {
      if (!this.valueListObserver) {
        this.valueListObserver = new ValueListObserver(this.element, this.actionAttribute, this);
        this.valueListObserver.start();
      }
    }
    stop() {
      if (this.valueListObserver) {
        this.valueListObserver.stop();
        delete this.valueListObserver;
        this.disconnectAllActions();
      }
    }
    get element() {
      return this.context.element;
    }
    get identifier() {
      return this.context.identifier;
    }
    get actionAttribute() {
      return this.schema.actionAttribute;
    }
    get schema() {
      return this.context.schema;
    }
    get bindings() {
      return Array.from(this.bindingsByAction.values());
    }
    connectAction(action) {
      const binding = new Binding(this.context, action);
      this.bindingsByAction.set(action, binding);
      this.delegate.bindingConnected(binding);
    }
    disconnectAction(action) {
      const binding = this.bindingsByAction.get(action);
      if (binding) {
        this.bindingsByAction.delete(action);
        this.delegate.bindingDisconnected(binding);
      }
    }
    disconnectAllActions() {
      this.bindings.forEach((binding) => this.delegate.bindingDisconnected(binding));
      this.bindingsByAction.clear();
    }
    parseValueForToken(token) {
      const action = Action.forToken(token);
      if (action.identifier == this.identifier) {
        return action;
      }
    }
    elementMatchedValue(element, action) {
      this.connectAction(action);
    }
    elementUnmatchedValue(element, action) {
      this.disconnectAction(action);
    }
  };
  var ValueObserver = class {
    constructor(context, receiver) {
      this.context = context;
      this.receiver = receiver;
      this.stringMapObserver = new StringMapObserver(this.element, this);
      this.valueDescriptorMap = this.controller.valueDescriptorMap;
      this.invokeChangedCallbacksForDefaultValues();
    }
    start() {
      this.stringMapObserver.start();
    }
    stop() {
      this.stringMapObserver.stop();
    }
    get element() {
      return this.context.element;
    }
    get controller() {
      return this.context.controller;
    }
    getStringMapKeyForAttribute(attributeName) {
      if (attributeName in this.valueDescriptorMap) {
        return this.valueDescriptorMap[attributeName].name;
      }
    }
    stringMapKeyAdded(key, attributeName) {
      const descriptor = this.valueDescriptorMap[attributeName];
      if (!this.hasValue(key)) {
        this.invokeChangedCallback(key, descriptor.writer(this.receiver[key]), descriptor.writer(descriptor.defaultValue));
      }
    }
    stringMapValueChanged(value, name, oldValue) {
      const descriptor = this.valueDescriptorNameMap[name];
      if (value === null)
        return;
      if (oldValue === null) {
        oldValue = descriptor.writer(descriptor.defaultValue);
      }
      this.invokeChangedCallback(name, value, oldValue);
    }
    stringMapKeyRemoved(key, attributeName, oldValue) {
      const descriptor = this.valueDescriptorNameMap[key];
      if (this.hasValue(key)) {
        this.invokeChangedCallback(key, descriptor.writer(this.receiver[key]), oldValue);
      } else {
        this.invokeChangedCallback(key, descriptor.writer(descriptor.defaultValue), oldValue);
      }
    }
    invokeChangedCallbacksForDefaultValues() {
      for (const { key, name, defaultValue, writer } of this.valueDescriptors) {
        if (defaultValue != void 0 && !this.controller.data.has(key)) {
          this.invokeChangedCallback(name, writer(defaultValue), void 0);
        }
      }
    }
    invokeChangedCallback(name, rawValue, rawOldValue) {
      const changedMethodName = `${name}Changed`;
      const changedMethod = this.receiver[changedMethodName];
      if (typeof changedMethod == "function") {
        const descriptor = this.valueDescriptorNameMap[name];
        const value = descriptor.reader(rawValue);
        let oldValue = rawOldValue;
        if (rawOldValue) {
          oldValue = descriptor.reader(rawOldValue);
        }
        changedMethod.call(this.receiver, value, oldValue);
      }
    }
    get valueDescriptors() {
      const { valueDescriptorMap } = this;
      return Object.keys(valueDescriptorMap).map((key) => valueDescriptorMap[key]);
    }
    get valueDescriptorNameMap() {
      const descriptors = {};
      Object.keys(this.valueDescriptorMap).forEach((key) => {
        const descriptor = this.valueDescriptorMap[key];
        descriptors[descriptor.name] = descriptor;
      });
      return descriptors;
    }
    hasValue(attributeName) {
      const descriptor = this.valueDescriptorNameMap[attributeName];
      const hasMethodName = `has${capitalize(descriptor.name)}`;
      return this.receiver[hasMethodName];
    }
  };
  var TargetObserver = class {
    constructor(context, delegate) {
      this.context = context;
      this.delegate = delegate;
      this.targetsByName = new Multimap();
    }
    start() {
      if (!this.tokenListObserver) {
        this.tokenListObserver = new TokenListObserver(this.element, this.attributeName, this);
        this.tokenListObserver.start();
      }
    }
    stop() {
      if (this.tokenListObserver) {
        this.disconnectAllTargets();
        this.tokenListObserver.stop();
        delete this.tokenListObserver;
      }
    }
    tokenMatched({ element, content: name }) {
      if (this.scope.containsElement(element)) {
        this.connectTarget(element, name);
      }
    }
    tokenUnmatched({ element, content: name }) {
      this.disconnectTarget(element, name);
    }
    connectTarget(element, name) {
      var _a;
      if (!this.targetsByName.has(name, element)) {
        this.targetsByName.add(name, element);
        (_a = this.tokenListObserver) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.targetConnected(element, name));
      }
    }
    disconnectTarget(element, name) {
      var _a;
      if (this.targetsByName.has(name, element)) {
        this.targetsByName.delete(name, element);
        (_a = this.tokenListObserver) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.targetDisconnected(element, name));
      }
    }
    disconnectAllTargets() {
      for (const name of this.targetsByName.keys) {
        for (const element of this.targetsByName.getValuesForKey(name)) {
          this.disconnectTarget(element, name);
        }
      }
    }
    get attributeName() {
      return `data-${this.context.identifier}-target`;
    }
    get element() {
      return this.context.element;
    }
    get scope() {
      return this.context.scope;
    }
  };
  var Context = class {
    constructor(module, scope) {
      this.logDebugActivity = (functionName, detail = {}) => {
        const { identifier, controller, element } = this;
        detail = Object.assign({ identifier, controller, element }, detail);
        this.application.logDebugActivity(this.identifier, functionName, detail);
      };
      this.module = module;
      this.scope = scope;
      this.controller = new module.controllerConstructor(this);
      this.bindingObserver = new BindingObserver(this, this.dispatcher);
      this.valueObserver = new ValueObserver(this, this.controller);
      this.targetObserver = new TargetObserver(this, this);
      try {
        this.controller.initialize();
        this.logDebugActivity("initialize");
      } catch (error4) {
        this.handleError(error4, "initializing controller");
      }
    }
    connect() {
      this.bindingObserver.start();
      this.valueObserver.start();
      this.targetObserver.start();
      try {
        this.controller.connect();
        this.logDebugActivity("connect");
      } catch (error4) {
        this.handleError(error4, "connecting controller");
      }
    }
    disconnect() {
      try {
        this.controller.disconnect();
        this.logDebugActivity("disconnect");
      } catch (error4) {
        this.handleError(error4, "disconnecting controller");
      }
      this.targetObserver.stop();
      this.valueObserver.stop();
      this.bindingObserver.stop();
    }
    get application() {
      return this.module.application;
    }
    get identifier() {
      return this.module.identifier;
    }
    get schema() {
      return this.application.schema;
    }
    get dispatcher() {
      return this.application.dispatcher;
    }
    get element() {
      return this.scope.element;
    }
    get parentElement() {
      return this.element.parentElement;
    }
    handleError(error4, message, detail = {}) {
      const { identifier, controller, element } = this;
      detail = Object.assign({ identifier, controller, element }, detail);
      this.application.handleError(error4, `Error ${message}`, detail);
    }
    targetConnected(element, name) {
      this.invokeControllerMethod(`${name}TargetConnected`, element);
    }
    targetDisconnected(element, name) {
      this.invokeControllerMethod(`${name}TargetDisconnected`, element);
    }
    invokeControllerMethod(methodName, ...args) {
      const controller = this.controller;
      if (typeof controller[methodName] == "function") {
        controller[methodName](...args);
      }
    }
  };
  function readInheritableStaticArrayValues(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor(constructor);
    return Array.from(ancestors.reduce((values, constructor2) => {
      getOwnStaticArrayValues(constructor2, propertyName).forEach((name) => values.add(name));
      return values;
    }, new Set()));
  }
  function readInheritableStaticObjectPairs(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor(constructor);
    return ancestors.reduce((pairs, constructor2) => {
      pairs.push(...getOwnStaticObjectPairs(constructor2, propertyName));
      return pairs;
    }, []);
  }
  function getAncestorsForConstructor(constructor) {
    const ancestors = [];
    while (constructor) {
      ancestors.push(constructor);
      constructor = Object.getPrototypeOf(constructor);
    }
    return ancestors.reverse();
  }
  function getOwnStaticArrayValues(constructor, propertyName) {
    const definition = constructor[propertyName];
    return Array.isArray(definition) ? definition : [];
  }
  function getOwnStaticObjectPairs(constructor, propertyName) {
    const definition = constructor[propertyName];
    return definition ? Object.keys(definition).map((key) => [key, definition[key]]) : [];
  }
  function bless(constructor) {
    return shadow(constructor, getBlessedProperties(constructor));
  }
  function shadow(constructor, properties) {
    const shadowConstructor = extend2(constructor);
    const shadowProperties = getShadowProperties(constructor.prototype, properties);
    Object.defineProperties(shadowConstructor.prototype, shadowProperties);
    return shadowConstructor;
  }
  function getBlessedProperties(constructor) {
    const blessings = readInheritableStaticArrayValues(constructor, "blessings");
    return blessings.reduce((blessedProperties, blessing) => {
      const properties = blessing(constructor);
      for (const key in properties) {
        const descriptor = blessedProperties[key] || {};
        blessedProperties[key] = Object.assign(descriptor, properties[key]);
      }
      return blessedProperties;
    }, {});
  }
  function getShadowProperties(prototype, properties) {
    return getOwnKeys(properties).reduce((shadowProperties, key) => {
      const descriptor = getShadowedDescriptor(prototype, properties, key);
      if (descriptor) {
        Object.assign(shadowProperties, { [key]: descriptor });
      }
      return shadowProperties;
    }, {});
  }
  function getShadowedDescriptor(prototype, properties, key) {
    const shadowingDescriptor = Object.getOwnPropertyDescriptor(prototype, key);
    const shadowedByValue = shadowingDescriptor && "value" in shadowingDescriptor;
    if (!shadowedByValue) {
      const descriptor = Object.getOwnPropertyDescriptor(properties, key).value;
      if (shadowingDescriptor) {
        descriptor.get = shadowingDescriptor.get || descriptor.get;
        descriptor.set = shadowingDescriptor.set || descriptor.set;
      }
      return descriptor;
    }
  }
  var getOwnKeys = (() => {
    if (typeof Object.getOwnPropertySymbols == "function") {
      return (object) => [
        ...Object.getOwnPropertyNames(object),
        ...Object.getOwnPropertySymbols(object)
      ];
    } else {
      return Object.getOwnPropertyNames;
    }
  })();
  var extend2 = (() => {
    function extendWithReflect(constructor) {
      function extended() {
        return Reflect.construct(constructor, arguments, new.target);
      }
      extended.prototype = Object.create(constructor.prototype, {
        constructor: { value: extended }
      });
      Reflect.setPrototypeOf(extended, constructor);
      return extended;
    }
    function testReflectExtension() {
      const a2 = function() {
        this.a.call(this);
      };
      const b = extendWithReflect(a2);
      b.prototype.a = function() {
      };
      return new b();
    }
    try {
      testReflectExtension();
      return extendWithReflect;
    } catch (error4) {
      return (constructor) => class extended extends constructor {
      };
    }
  })();
  function blessDefinition(definition) {
    return {
      identifier: definition.identifier,
      controllerConstructor: bless(definition.controllerConstructor)
    };
  }
  var Module = class {
    constructor(application2, definition) {
      this.application = application2;
      this.definition = blessDefinition(definition);
      this.contextsByScope = new WeakMap();
      this.connectedContexts = new Set();
    }
    get identifier() {
      return this.definition.identifier;
    }
    get controllerConstructor() {
      return this.definition.controllerConstructor;
    }
    get contexts() {
      return Array.from(this.connectedContexts);
    }
    connectContextForScope(scope) {
      const context = this.fetchContextForScope(scope);
      this.connectedContexts.add(context);
      context.connect();
    }
    disconnectContextForScope(scope) {
      const context = this.contextsByScope.get(scope);
      if (context) {
        this.connectedContexts.delete(context);
        context.disconnect();
      }
    }
    fetchContextForScope(scope) {
      let context = this.contextsByScope.get(scope);
      if (!context) {
        context = new Context(this, scope);
        this.contextsByScope.set(scope, context);
      }
      return context;
    }
  };
  var ClassMap = class {
    constructor(scope) {
      this.scope = scope;
    }
    has(name) {
      return this.data.has(this.getDataKey(name));
    }
    get(name) {
      return this.getAll(name)[0];
    }
    getAll(name) {
      const tokenString = this.data.get(this.getDataKey(name)) || "";
      return tokenize(tokenString);
    }
    getAttributeName(name) {
      return this.data.getAttributeNameForKey(this.getDataKey(name));
    }
    getDataKey(name) {
      return `${name}-class`;
    }
    get data() {
      return this.scope.data;
    }
  };
  var DataMap = class {
    constructor(scope) {
      this.scope = scope;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get(key) {
      const name = this.getAttributeNameForKey(key);
      return this.element.getAttribute(name);
    }
    set(key, value) {
      const name = this.getAttributeNameForKey(key);
      this.element.setAttribute(name, value);
      return this.get(key);
    }
    has(key) {
      const name = this.getAttributeNameForKey(key);
      return this.element.hasAttribute(name);
    }
    delete(key) {
      if (this.has(key)) {
        const name = this.getAttributeNameForKey(key);
        this.element.removeAttribute(name);
        return true;
      } else {
        return false;
      }
    }
    getAttributeNameForKey(key) {
      return `data-${this.identifier}-${dasherize(key)}`;
    }
  };
  var Guide = class {
    constructor(logger) {
      this.warnedKeysByObject = new WeakMap();
      this.logger = logger;
    }
    warn(object, key, message) {
      let warnedKeys = this.warnedKeysByObject.get(object);
      if (!warnedKeys) {
        warnedKeys = new Set();
        this.warnedKeysByObject.set(object, warnedKeys);
      }
      if (!warnedKeys.has(key)) {
        warnedKeys.add(key);
        this.logger.warn(message, object);
      }
    }
  };
  function attributeValueContainsToken(attributeName, token) {
    return `[${attributeName}~="${token}"]`;
  }
  var TargetSet = class {
    constructor(scope) {
      this.scope = scope;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get schema() {
      return this.scope.schema;
    }
    has(targetName) {
      return this.find(targetName) != null;
    }
    find(...targetNames) {
      return targetNames.reduce((target, targetName) => target || this.findTarget(targetName) || this.findLegacyTarget(targetName), void 0);
    }
    findAll(...targetNames) {
      return targetNames.reduce((targets, targetName) => [
        ...targets,
        ...this.findAllTargets(targetName),
        ...this.findAllLegacyTargets(targetName)
      ], []);
    }
    findTarget(targetName) {
      const selector = this.getSelectorForTargetName(targetName);
      return this.scope.findElement(selector);
    }
    findAllTargets(targetName) {
      const selector = this.getSelectorForTargetName(targetName);
      return this.scope.findAllElements(selector);
    }
    getSelectorForTargetName(targetName) {
      const attributeName = this.schema.targetAttributeForScope(this.identifier);
      return attributeValueContainsToken(attributeName, targetName);
    }
    findLegacyTarget(targetName) {
      const selector = this.getLegacySelectorForTargetName(targetName);
      return this.deprecate(this.scope.findElement(selector), targetName);
    }
    findAllLegacyTargets(targetName) {
      const selector = this.getLegacySelectorForTargetName(targetName);
      return this.scope.findAllElements(selector).map((element) => this.deprecate(element, targetName));
    }
    getLegacySelectorForTargetName(targetName) {
      const targetDescriptor = `${this.identifier}.${targetName}`;
      return attributeValueContainsToken(this.schema.targetAttribute, targetDescriptor);
    }
    deprecate(element, targetName) {
      if (element) {
        const { identifier } = this;
        const attributeName = this.schema.targetAttribute;
        const revisedAttributeName = this.schema.targetAttributeForScope(identifier);
        this.guide.warn(element, `target:${targetName}`, `Please replace ${attributeName}="${identifier}.${targetName}" with ${revisedAttributeName}="${targetName}". The ${attributeName} attribute is deprecated and will be removed in a future version of Stimulus.`);
      }
      return element;
    }
    get guide() {
      return this.scope.guide;
    }
  };
  var Scope = class {
    constructor(schema2, element, identifier, logger) {
      this.targets = new TargetSet(this);
      this.classes = new ClassMap(this);
      this.data = new DataMap(this);
      this.containsElement = (element2) => {
        return element2.closest(this.controllerSelector) === this.element;
      };
      this.schema = schema2;
      this.element = element;
      this.identifier = identifier;
      this.guide = new Guide(logger);
    }
    findElement(selector) {
      return this.element.matches(selector) ? this.element : this.queryElements(selector).find(this.containsElement);
    }
    findAllElements(selector) {
      return [
        ...this.element.matches(selector) ? [this.element] : [],
        ...this.queryElements(selector).filter(this.containsElement)
      ];
    }
    queryElements(selector) {
      return Array.from(this.element.querySelectorAll(selector));
    }
    get controllerSelector() {
      return attributeValueContainsToken(this.schema.controllerAttribute, this.identifier);
    }
  };
  var ScopeObserver = class {
    constructor(element, schema2, delegate) {
      this.element = element;
      this.schema = schema2;
      this.delegate = delegate;
      this.valueListObserver = new ValueListObserver(this.element, this.controllerAttribute, this);
      this.scopesByIdentifierByElement = new WeakMap();
      this.scopeReferenceCounts = new WeakMap();
    }
    start() {
      this.valueListObserver.start();
    }
    stop() {
      this.valueListObserver.stop();
    }
    get controllerAttribute() {
      return this.schema.controllerAttribute;
    }
    parseValueForToken(token) {
      const { element, content: identifier } = token;
      const scopesByIdentifier = this.fetchScopesByIdentifierForElement(element);
      let scope = scopesByIdentifier.get(identifier);
      if (!scope) {
        scope = this.delegate.createScopeForElementAndIdentifier(element, identifier);
        scopesByIdentifier.set(identifier, scope);
      }
      return scope;
    }
    elementMatchedValue(element, value) {
      const referenceCount = (this.scopeReferenceCounts.get(value) || 0) + 1;
      this.scopeReferenceCounts.set(value, referenceCount);
      if (referenceCount == 1) {
        this.delegate.scopeConnected(value);
      }
    }
    elementUnmatchedValue(element, value) {
      const referenceCount = this.scopeReferenceCounts.get(value);
      if (referenceCount) {
        this.scopeReferenceCounts.set(value, referenceCount - 1);
        if (referenceCount == 1) {
          this.delegate.scopeDisconnected(value);
        }
      }
    }
    fetchScopesByIdentifierForElement(element) {
      let scopesByIdentifier = this.scopesByIdentifierByElement.get(element);
      if (!scopesByIdentifier) {
        scopesByIdentifier = new Map();
        this.scopesByIdentifierByElement.set(element, scopesByIdentifier);
      }
      return scopesByIdentifier;
    }
  };
  var Router = class {
    constructor(application2) {
      this.application = application2;
      this.scopeObserver = new ScopeObserver(this.element, this.schema, this);
      this.scopesByIdentifier = new Multimap();
      this.modulesByIdentifier = new Map();
    }
    get element() {
      return this.application.element;
    }
    get schema() {
      return this.application.schema;
    }
    get logger() {
      return this.application.logger;
    }
    get controllerAttribute() {
      return this.schema.controllerAttribute;
    }
    get modules() {
      return Array.from(this.modulesByIdentifier.values());
    }
    get contexts() {
      return this.modules.reduce((contexts, module) => contexts.concat(module.contexts), []);
    }
    start() {
      this.scopeObserver.start();
    }
    stop() {
      this.scopeObserver.stop();
    }
    loadDefinition(definition) {
      this.unloadIdentifier(definition.identifier);
      const module = new Module(this.application, definition);
      this.connectModule(module);
    }
    unloadIdentifier(identifier) {
      const module = this.modulesByIdentifier.get(identifier);
      if (module) {
        this.disconnectModule(module);
      }
    }
    getContextForElementAndIdentifier(element, identifier) {
      const module = this.modulesByIdentifier.get(identifier);
      if (module) {
        return module.contexts.find((context) => context.element == element);
      }
    }
    handleError(error4, message, detail) {
      this.application.handleError(error4, message, detail);
    }
    createScopeForElementAndIdentifier(element, identifier) {
      return new Scope(this.schema, element, identifier, this.logger);
    }
    scopeConnected(scope) {
      this.scopesByIdentifier.add(scope.identifier, scope);
      const module = this.modulesByIdentifier.get(scope.identifier);
      if (module) {
        module.connectContextForScope(scope);
      }
    }
    scopeDisconnected(scope) {
      this.scopesByIdentifier.delete(scope.identifier, scope);
      const module = this.modulesByIdentifier.get(scope.identifier);
      if (module) {
        module.disconnectContextForScope(scope);
      }
    }
    connectModule(module) {
      this.modulesByIdentifier.set(module.identifier, module);
      const scopes = this.scopesByIdentifier.getValuesForKey(module.identifier);
      scopes.forEach((scope) => module.connectContextForScope(scope));
    }
    disconnectModule(module) {
      this.modulesByIdentifier.delete(module.identifier);
      const scopes = this.scopesByIdentifier.getValuesForKey(module.identifier);
      scopes.forEach((scope) => module.disconnectContextForScope(scope));
    }
  };
  var defaultSchema = {
    controllerAttribute: "data-controller",
    actionAttribute: "data-action",
    targetAttribute: "data-target",
    targetAttributeForScope: (identifier) => `data-${identifier}-target`
  };
  var Application = class {
    constructor(element = document.documentElement, schema2 = defaultSchema) {
      this.logger = console;
      this.debug = false;
      this.logDebugActivity = (identifier, functionName, detail = {}) => {
        if (this.debug) {
          this.logFormattedMessage(identifier, functionName, detail);
        }
      };
      this.element = element;
      this.schema = schema2;
      this.dispatcher = new Dispatcher(this);
      this.router = new Router(this);
    }
    static start(element, schema2) {
      const application2 = new Application(element, schema2);
      application2.start();
      return application2;
    }
    async start() {
      await domReady();
      this.logDebugActivity("application", "starting");
      this.dispatcher.start();
      this.router.start();
      this.logDebugActivity("application", "start");
    }
    stop() {
      this.logDebugActivity("application", "stopping");
      this.dispatcher.stop();
      this.router.stop();
      this.logDebugActivity("application", "stop");
    }
    register(identifier, controllerConstructor) {
      if (controllerConstructor.shouldLoad) {
        this.load({ identifier, controllerConstructor });
      }
    }
    load(head, ...rest) {
      const definitions = Array.isArray(head) ? head : [head, ...rest];
      definitions.forEach((definition) => this.router.loadDefinition(definition));
    }
    unload(head, ...rest) {
      const identifiers = Array.isArray(head) ? head : [head, ...rest];
      identifiers.forEach((identifier) => this.router.unloadIdentifier(identifier));
    }
    get controllers() {
      return this.router.contexts.map((context) => context.controller);
    }
    getControllerForElementAndIdentifier(element, identifier) {
      const context = this.router.getContextForElementAndIdentifier(element, identifier);
      return context ? context.controller : null;
    }
    handleError(error4, message, detail) {
      var _a;
      this.logger.error(`%s

%o

%o`, message, error4, detail);
      (_a = window.onerror) === null || _a === void 0 ? void 0 : _a.call(window, message, "", 0, 0, error4);
    }
    logFormattedMessage(identifier, functionName, detail = {}) {
      detail = Object.assign({ application: this }, detail);
      this.logger.groupCollapsed(`${identifier} #${functionName}`);
      this.logger.log("details:", Object.assign({}, detail));
      this.logger.groupEnd();
    }
  };
  function domReady() {
    return new Promise((resolve) => {
      if (document.readyState == "loading") {
        document.addEventListener("DOMContentLoaded", () => resolve());
      } else {
        resolve();
      }
    });
  }
  function ClassPropertiesBlessing(constructor) {
    const classes = readInheritableStaticArrayValues(constructor, "classes");
    return classes.reduce((properties, classDefinition) => {
      return Object.assign(properties, propertiesForClassDefinition(classDefinition));
    }, {});
  }
  function propertiesForClassDefinition(key) {
    return {
      [`${key}Class`]: {
        get() {
          const { classes } = this;
          if (classes.has(key)) {
            return classes.get(key);
          } else {
            const attribute = classes.getAttributeName(key);
            throw new Error(`Missing attribute "${attribute}"`);
          }
        }
      },
      [`${key}Classes`]: {
        get() {
          return this.classes.getAll(key);
        }
      },
      [`has${capitalize(key)}Class`]: {
        get() {
          return this.classes.has(key);
        }
      }
    };
  }
  function TargetPropertiesBlessing(constructor) {
    const targets = readInheritableStaticArrayValues(constructor, "targets");
    return targets.reduce((properties, targetDefinition) => {
      return Object.assign(properties, propertiesForTargetDefinition(targetDefinition));
    }, {});
  }
  function propertiesForTargetDefinition(name) {
    return {
      [`${name}Target`]: {
        get() {
          const target = this.targets.find(name);
          if (target) {
            return target;
          } else {
            throw new Error(`Missing target element "${name}" for "${this.identifier}" controller`);
          }
        }
      },
      [`${name}Targets`]: {
        get() {
          return this.targets.findAll(name);
        }
      },
      [`has${capitalize(name)}Target`]: {
        get() {
          return this.targets.has(name);
        }
      }
    };
  }
  function ValuePropertiesBlessing(constructor) {
    const valueDefinitionPairs = readInheritableStaticObjectPairs(constructor, "values");
    const propertyDescriptorMap = {
      valueDescriptorMap: {
        get() {
          return valueDefinitionPairs.reduce((result, valueDefinitionPair) => {
            const valueDescriptor = parseValueDefinitionPair(valueDefinitionPair);
            const attributeName = this.data.getAttributeNameForKey(valueDescriptor.key);
            return Object.assign(result, { [attributeName]: valueDescriptor });
          }, {});
        }
      }
    };
    return valueDefinitionPairs.reduce((properties, valueDefinitionPair) => {
      return Object.assign(properties, propertiesForValueDefinitionPair(valueDefinitionPair));
    }, propertyDescriptorMap);
  }
  function propertiesForValueDefinitionPair(valueDefinitionPair) {
    const definition = parseValueDefinitionPair(valueDefinitionPair);
    const { key, name, reader: read, writer: write } = definition;
    return {
      [name]: {
        get() {
          const value = this.data.get(key);
          if (value !== null) {
            return read(value);
          } else {
            return definition.defaultValue;
          }
        },
        set(value) {
          if (value === void 0) {
            this.data.delete(key);
          } else {
            this.data.set(key, write(value));
          }
        }
      },
      [`has${capitalize(name)}`]: {
        get() {
          return this.data.has(key) || definition.hasCustomDefaultValue;
        }
      }
    };
  }
  function parseValueDefinitionPair([token, typeDefinition]) {
    return valueDescriptorForTokenAndTypeDefinition(token, typeDefinition);
  }
  function parseValueTypeConstant(constant) {
    switch (constant) {
      case Array:
        return "array";
      case Boolean:
        return "boolean";
      case Number:
        return "number";
      case Object:
        return "object";
      case String:
        return "string";
    }
  }
  function parseValueTypeDefault(defaultValue) {
    switch (typeof defaultValue) {
      case "boolean":
        return "boolean";
      case "number":
        return "number";
      case "string":
        return "string";
    }
    if (Array.isArray(defaultValue))
      return "array";
    if (Object.prototype.toString.call(defaultValue) === "[object Object]")
      return "object";
  }
  function parseValueTypeObject(typeObject) {
    const typeFromObject = parseValueTypeConstant(typeObject.type);
    if (typeFromObject) {
      const defaultValueType = parseValueTypeDefault(typeObject.default);
      if (typeFromObject !== defaultValueType) {
        throw new Error(`Type "${typeFromObject}" must match the type of the default value. Given default value: "${typeObject.default}" as "${defaultValueType}"`);
      }
      return typeFromObject;
    }
  }
  function parseValueTypeDefinition(typeDefinition) {
    const typeFromObject = parseValueTypeObject(typeDefinition);
    const typeFromDefaultValue = parseValueTypeDefault(typeDefinition);
    const typeFromConstant = parseValueTypeConstant(typeDefinition);
    const type = typeFromObject || typeFromDefaultValue || typeFromConstant;
    if (type)
      return type;
    throw new Error(`Unknown value type "${typeDefinition}"`);
  }
  function defaultValueForDefinition(typeDefinition) {
    const constant = parseValueTypeConstant(typeDefinition);
    if (constant)
      return defaultValuesByType[constant];
    const defaultValue = typeDefinition.default;
    if (defaultValue !== void 0)
      return defaultValue;
    return typeDefinition;
  }
  function valueDescriptorForTokenAndTypeDefinition(token, typeDefinition) {
    const key = `${dasherize(token)}-value`;
    const type = parseValueTypeDefinition(typeDefinition);
    return {
      type,
      key,
      name: camelize(key),
      get defaultValue() {
        return defaultValueForDefinition(typeDefinition);
      },
      get hasCustomDefaultValue() {
        return parseValueTypeDefault(typeDefinition) !== void 0;
      },
      reader: readers[type],
      writer: writers[type] || writers.default
    };
  }
  var defaultValuesByType = {
    get array() {
      return [];
    },
    boolean: false,
    number: 0,
    get object() {
      return {};
    },
    string: ""
  };
  var readers = {
    array(value) {
      const array = JSON.parse(value);
      if (!Array.isArray(array)) {
        throw new TypeError("Expected array");
      }
      return array;
    },
    boolean(value) {
      return !(value == "0" || value == "false");
    },
    number(value) {
      return Number(value);
    },
    object(value) {
      const object = JSON.parse(value);
      if (object === null || typeof object != "object" || Array.isArray(object)) {
        throw new TypeError("Expected object");
      }
      return object;
    },
    string(value) {
      return value;
    }
  };
  var writers = {
    default: writeString,
    array: writeJSON,
    object: writeJSON
  };
  function writeJSON(value) {
    return JSON.stringify(value);
  }
  function writeString(value) {
    return `${value}`;
  }
  var Controller = class {
    constructor(context) {
      this.context = context;
    }
    static get shouldLoad() {
      return true;
    }
    get application() {
      return this.context.application;
    }
    get scope() {
      return this.context.scope;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get targets() {
      return this.scope.targets;
    }
    get classes() {
      return this.scope.classes;
    }
    get data() {
      return this.scope.data;
    }
    initialize() {
    }
    connect() {
    }
    disconnect() {
    }
    dispatch(eventName, { target = this.element, detail = {}, prefix = this.identifier, bubbles = true, cancelable = true } = {}) {
      const type = prefix ? `${prefix}:${eventName}` : eventName;
      const event = new CustomEvent(type, { detail, bubbles, cancelable });
      target.dispatchEvent(event);
      return event;
    }
  };
  Controller.blessings = [ClassPropertiesBlessing, TargetPropertiesBlessing, ValuePropertiesBlessing];
  Controller.targets = [];
  Controller.values = {};

  // app/javascript/controllers/application.js
  var application = Application.start();
  application.warnings = true;
  application.debug = false;
  window.Stimulus = application;

  // node_modules/stimulus/dist/stimulus.js
  function camelize2(value) {
    return value.replace(/(?:[_-])([a-z0-9])/g, (_, char) => char.toUpperCase());
  }
  function capitalize2(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  function dasherize2(value) {
    return value.replace(/([A-Z])/g, (_, char) => `-${char.toLowerCase()}`);
  }
  function readInheritableStaticArrayValues2(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor2(constructor);
    return Array.from(ancestors.reduce((values, constructor2) => {
      getOwnStaticArrayValues2(constructor2, propertyName).forEach((name) => values.add(name));
      return values;
    }, new Set()));
  }
  function readInheritableStaticObjectPairs2(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor2(constructor);
    return ancestors.reduce((pairs, constructor2) => {
      pairs.push(...getOwnStaticObjectPairs2(constructor2, propertyName));
      return pairs;
    }, []);
  }
  function getAncestorsForConstructor2(constructor) {
    const ancestors = [];
    while (constructor) {
      ancestors.push(constructor);
      constructor = Object.getPrototypeOf(constructor);
    }
    return ancestors.reverse();
  }
  function getOwnStaticArrayValues2(constructor, propertyName) {
    const definition = constructor[propertyName];
    return Array.isArray(definition) ? definition : [];
  }
  function getOwnStaticObjectPairs2(constructor, propertyName) {
    const definition = constructor[propertyName];
    return definition ? Object.keys(definition).map((key) => [key, definition[key]]) : [];
  }
  var getOwnKeys2 = (() => {
    if (typeof Object.getOwnPropertySymbols == "function") {
      return (object) => [
        ...Object.getOwnPropertyNames(object),
        ...Object.getOwnPropertySymbols(object)
      ];
    } else {
      return Object.getOwnPropertyNames;
    }
  })();
  var extend3 = (() => {
    function extendWithReflect(constructor) {
      function extended() {
        return Reflect.construct(constructor, arguments, new.target);
      }
      extended.prototype = Object.create(constructor.prototype, {
        constructor: { value: extended }
      });
      Reflect.setPrototypeOf(extended, constructor);
      return extended;
    }
    function testReflectExtension() {
      const a2 = function() {
        this.a.call(this);
      };
      const b = extendWithReflect(a2);
      b.prototype.a = function() {
      };
      return new b();
    }
    try {
      testReflectExtension();
      return extendWithReflect;
    } catch (error4) {
      return (constructor) => class extended extends constructor {
      };
    }
  })();
  function ClassPropertiesBlessing2(constructor) {
    const classes = readInheritableStaticArrayValues2(constructor, "classes");
    return classes.reduce((properties, classDefinition) => {
      return Object.assign(properties, propertiesForClassDefinition2(classDefinition));
    }, {});
  }
  function propertiesForClassDefinition2(key) {
    return {
      [`${key}Class`]: {
        get() {
          const { classes } = this;
          if (classes.has(key)) {
            return classes.get(key);
          } else {
            const attribute = classes.getAttributeName(key);
            throw new Error(`Missing attribute "${attribute}"`);
          }
        }
      },
      [`${key}Classes`]: {
        get() {
          return this.classes.getAll(key);
        }
      },
      [`has${capitalize2(key)}Class`]: {
        get() {
          return this.classes.has(key);
        }
      }
    };
  }
  function TargetPropertiesBlessing2(constructor) {
    const targets = readInheritableStaticArrayValues2(constructor, "targets");
    return targets.reduce((properties, targetDefinition) => {
      return Object.assign(properties, propertiesForTargetDefinition2(targetDefinition));
    }, {});
  }
  function propertiesForTargetDefinition2(name) {
    return {
      [`${name}Target`]: {
        get() {
          const target = this.targets.find(name);
          if (target) {
            return target;
          } else {
            throw new Error(`Missing target element "${name}" for "${this.identifier}" controller`);
          }
        }
      },
      [`${name}Targets`]: {
        get() {
          return this.targets.findAll(name);
        }
      },
      [`has${capitalize2(name)}Target`]: {
        get() {
          return this.targets.has(name);
        }
      }
    };
  }
  function ValuePropertiesBlessing2(constructor) {
    const valueDefinitionPairs = readInheritableStaticObjectPairs2(constructor, "values");
    const propertyDescriptorMap = {
      valueDescriptorMap: {
        get() {
          return valueDefinitionPairs.reduce((result, valueDefinitionPair) => {
            const valueDescriptor = parseValueDefinitionPair2(valueDefinitionPair);
            const attributeName = this.data.getAttributeNameForKey(valueDescriptor.key);
            return Object.assign(result, { [attributeName]: valueDescriptor });
          }, {});
        }
      }
    };
    return valueDefinitionPairs.reduce((properties, valueDefinitionPair) => {
      return Object.assign(properties, propertiesForValueDefinitionPair2(valueDefinitionPair));
    }, propertyDescriptorMap);
  }
  function propertiesForValueDefinitionPair2(valueDefinitionPair) {
    const definition = parseValueDefinitionPair2(valueDefinitionPair);
    const { key, name, reader: read, writer: write } = definition;
    return {
      [name]: {
        get() {
          const value = this.data.get(key);
          if (value !== null) {
            return read(value);
          } else {
            return definition.defaultValue;
          }
        },
        set(value) {
          if (value === void 0) {
            this.data.delete(key);
          } else {
            this.data.set(key, write(value));
          }
        }
      },
      [`has${capitalize2(name)}`]: {
        get() {
          return this.data.has(key) || definition.hasCustomDefaultValue;
        }
      }
    };
  }
  function parseValueDefinitionPair2([token, typeDefinition]) {
    return valueDescriptorForTokenAndTypeDefinition2(token, typeDefinition);
  }
  function parseValueTypeConstant2(constant) {
    switch (constant) {
      case Array:
        return "array";
      case Boolean:
        return "boolean";
      case Number:
        return "number";
      case Object:
        return "object";
      case String:
        return "string";
    }
  }
  function parseValueTypeDefault2(defaultValue) {
    switch (typeof defaultValue) {
      case "boolean":
        return "boolean";
      case "number":
        return "number";
      case "string":
        return "string";
    }
    if (Array.isArray(defaultValue))
      return "array";
    if (Object.prototype.toString.call(defaultValue) === "[object Object]")
      return "object";
  }
  function parseValueTypeObject2(typeObject) {
    const typeFromObject = parseValueTypeConstant2(typeObject.type);
    if (typeFromObject) {
      const defaultValueType = parseValueTypeDefault2(typeObject.default);
      if (typeFromObject !== defaultValueType) {
        throw new Error(`Type "${typeFromObject}" must match the type of the default value. Given default value: "${typeObject.default}" as "${defaultValueType}"`);
      }
      return typeFromObject;
    }
  }
  function parseValueTypeDefinition2(typeDefinition) {
    const typeFromObject = parseValueTypeObject2(typeDefinition);
    const typeFromDefaultValue = parseValueTypeDefault2(typeDefinition);
    const typeFromConstant = parseValueTypeConstant2(typeDefinition);
    const type = typeFromObject || typeFromDefaultValue || typeFromConstant;
    if (type)
      return type;
    throw new Error(`Unknown value type "${typeDefinition}"`);
  }
  function defaultValueForDefinition2(typeDefinition) {
    const constant = parseValueTypeConstant2(typeDefinition);
    if (constant)
      return defaultValuesByType2[constant];
    const defaultValue = typeDefinition.default;
    if (defaultValue !== void 0)
      return defaultValue;
    return typeDefinition;
  }
  function valueDescriptorForTokenAndTypeDefinition2(token, typeDefinition) {
    const key = `${dasherize2(token)}-value`;
    const type = parseValueTypeDefinition2(typeDefinition);
    return {
      type,
      key,
      name: camelize2(key),
      get defaultValue() {
        return defaultValueForDefinition2(typeDefinition);
      },
      get hasCustomDefaultValue() {
        return parseValueTypeDefault2(typeDefinition) !== void 0;
      },
      reader: readers2[type],
      writer: writers2[type] || writers2.default
    };
  }
  var defaultValuesByType2 = {
    get array() {
      return [];
    },
    boolean: false,
    number: 0,
    get object() {
      return {};
    },
    string: ""
  };
  var readers2 = {
    array(value) {
      const array = JSON.parse(value);
      if (!Array.isArray(array)) {
        throw new TypeError("Expected array");
      }
      return array;
    },
    boolean(value) {
      return !(value == "0" || value == "false");
    },
    number(value) {
      return Number(value);
    },
    object(value) {
      const object = JSON.parse(value);
      if (object === null || typeof object != "object" || Array.isArray(object)) {
        throw new TypeError("Expected object");
      }
      return object;
    },
    string(value) {
      return value;
    }
  };
  var writers2 = {
    default: writeString2,
    array: writeJSON2,
    object: writeJSON2
  };
  function writeJSON2(value) {
    return JSON.stringify(value);
  }
  function writeString2(value) {
    return `${value}`;
  }
  var Controller2 = class {
    constructor(context) {
      this.context = context;
    }
    static get shouldLoad() {
      return true;
    }
    get application() {
      return this.context.application;
    }
    get scope() {
      return this.context.scope;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get targets() {
      return this.scope.targets;
    }
    get classes() {
      return this.scope.classes;
    }
    get data() {
      return this.scope.data;
    }
    initialize() {
    }
    connect() {
    }
    disconnect() {
    }
    dispatch(eventName, { target = this.element, detail = {}, prefix = this.identifier, bubbles = true, cancelable = true } = {}) {
      const type = prefix ? `${prefix}:${eventName}` : eventName;
      const event = new CustomEvent(type, { detail, bubbles, cancelable });
      target.dispatchEvent(event);
      return event;
    }
  };
  Controller2.blessings = [ClassPropertiesBlessing2, TargetPropertiesBlessing2, ValuePropertiesBlessing2];
  Controller2.targets = [];
  Controller2.values = {};

  // node_modules/stimulus_reflex/javascript/utils.js
  var uuidv4 = () => {
    const crypto = window.crypto || window.msCrypto;
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
  };
  var serializeForm = (form, options = {}) => {
    if (!form)
      return "";
    const w = options.w || window;
    const { element } = options;
    const formData = new w.FormData(form);
    const data = Array.from(formData, (e2) => e2.map(encodeURIComponent).join("="));
    const submitButton = form.querySelector("input[type=submit]");
    if (element && element.name && element.nodeName === "INPUT" && element.type === "submit") {
      data.push(`${encodeURIComponent(element.name)}=${encodeURIComponent(element.value)}`);
    } else if (submitButton && submitButton.name) {
      data.push(`${encodeURIComponent(submitButton.name)}=${encodeURIComponent(submitButton.value)}`);
    }
    return Array.from(data).join("&");
  };
  var camelize3 = (value, uppercaseFirstLetter = true) => {
    if (typeof value !== "string")
      return "";
    value = value.replace(/[\s_](.)/g, ($1) => $1.toUpperCase()).replace(/[\s_]/g, "").replace(/^(.)/, ($1) => $1.toLowerCase());
    if (uppercaseFirstLetter)
      value = value.substr(0, 1).toUpperCase() + value.substr(1);
    return value;
  };
  var debounce = (callback, delay = 250) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        timeoutId = null;
        callback(...args);
      }, delay);
    };
  };
  var extractReflexName = (reflexString) => {
    const match = reflexString.match(/(?:.*->)?(.*?)(?:Reflex)?#/);
    return match ? match[1] : "";
  };
  var emitEvent = (event, detail) => {
    document.dispatchEvent(new CustomEvent(event, {
      bubbles: true,
      cancelable: false,
      detail
    }));
    if (window.jQuery)
      window.jQuery(document).trigger(event, detail);
  };
  var elementToXPath = (element) => {
    if (element.id !== "")
      return "//*[@id='" + element.id + "']";
    if (element === document.body)
      return "/html/body";
    let ix = 0;
    const siblings = element.parentNode.childNodes;
    for (var i2 = 0; i2 < siblings.length; i2++) {
      const sibling = siblings[i2];
      if (sibling === element) {
        const computedPath = elementToXPath(element.parentNode);
        const tagName = element.tagName.toLowerCase();
        const ixInc = ix + 1;
        return `${computedPath}/${tagName}[${ixInc}]`;
      }
      if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
        ix++;
      }
    }
  };
  var XPathToElement = (xpath) => {
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  };
  var XPathToArray = (xpath, reverse = false) => {
    const snapshotList = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    const snapshots = [];
    for (let i2 = 0; i2 < snapshotList.snapshotLength; i2++) {
      snapshots.push(snapshotList.snapshotItem(i2));
    }
    return reverse ? snapshots.reverse() : snapshots;
  };

  // node_modules/stimulus_reflex/javascript/debug.js
  var debugging = false;
  var debug_default = {
    get enabled() {
      return debugging;
    },
    get disabled() {
      return !debugging;
    },
    get value() {
      return debugging;
    },
    set(value) {
      debugging = !!value;
    },
    set debug(value) {
      debugging = !!value;
    }
  };

  // node_modules/cable_ready/javascript/enums.js
  var inputTags = {
    INPUT: true,
    TEXTAREA: true,
    SELECT: true
  };
  var mutableTags = {
    INPUT: true,
    TEXTAREA: true,
    OPTION: true
  };
  var textInputTypes = {
    "datetime-local": true,
    "select-multiple": true,
    "select-one": true,
    color: true,
    date: true,
    datetime: true,
    email: true,
    month: true,
    number: true,
    password: true,
    range: true,
    search: true,
    tel: true,
    text: true,
    textarea: true,
    time: true,
    url: true,
    week: true
  };

  // node_modules/cable_ready/javascript/active_element.js
  var activeElement;
  var active_element_default = {
    get element() {
      return activeElement;
    },
    set(element) {
      activeElement = element;
    }
  };

  // node_modules/cable_ready/javascript/utils.js
  var isTextInput = (element) => {
    return inputTags[element.tagName] && textInputTypes[element.type];
  };
  var assignFocus = (selector) => {
    const element = selector && selector.nodeType === Node.ELEMENT_NODE ? selector : document.querySelector(selector);
    const focusElement = element || active_element_default.element;
    if (focusElement && focusElement.focus)
      focusElement.focus();
  };
  var dispatch2 = (element, name, detail = {}) => {
    const init = { bubbles: true, cancelable: true, detail };
    const evt = new CustomEvent(name, init);
    element.dispatchEvent(evt);
    if (window.jQuery)
      window.jQuery(element).trigger(name, detail);
  };
  var xpathToElement = (xpath) => {
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  };
  var getClassNames = (names) => Array(names).flat();
  var processElements = (operation, callback) => {
    Array.from(operation.selectAll ? operation.element : [operation.element]).forEach(callback);
  };
  var kebabize = (str) => {
    return str.split("").map((letter, idx) => {
      return letter.toUpperCase() === letter ? `${idx !== 0 ? "-" : ""}${letter.toLowerCase()}` : letter;
    }).join("");
  };
  var operate = (operation, callback) => {
    if (!operation.cancel) {
      operation.delay ? setTimeout(callback, operation.delay) : callback();
      return true;
    }
    return false;
  };
  var before = (target, operation) => dispatch2(target, `cable-ready:before-${kebabize(operation.operation)}`, operation);
  var after = (target, operation) => dispatch2(target, `cable-ready:after-${kebabize(operation.operation)}`, operation);
  function debounce2(func, timeout) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), timeout);
    };
  }
  function handleErrors(response) {
    if (!response.ok)
      throw Error(response.statusText);
    return response;
  }

  // node_modules/cable_ready/javascript/morph_callbacks.js
  var shouldMorph = (operation) => (fromEl, toEl) => {
    return !shouldMorphCallbacks.map((callback) => {
      return typeof callback === "function" ? callback(operation, fromEl, toEl) : true;
    }).includes(false);
  };
  var didMorph = (operation) => (el) => {
    didMorphCallbacks.forEach((callback) => {
      if (typeof callback === "function")
        callback(operation, el);
    });
  };
  var verifyNotMutable = (detail, fromEl, toEl) => {
    if (!mutableTags[fromEl.tagName] && fromEl.isEqualNode(toEl))
      return false;
    return true;
  };
  var verifyNotContentEditable = (detail, fromEl, toEl) => {
    if (fromEl === active_element_default.element && fromEl.isContentEditable)
      return false;
    return true;
  };
  var verifyNotPermanent = (detail, fromEl, toEl) => {
    const { permanentAttributeName } = detail;
    if (!permanentAttributeName)
      return true;
    const permanent = fromEl.closest(`[${permanentAttributeName}]`);
    if (!permanent && fromEl === active_element_default.element && isTextInput(fromEl)) {
      const ignore = { value: true };
      Array.from(toEl.attributes).forEach((attribute) => {
        if (!ignore[attribute.name])
          fromEl.setAttribute(attribute.name, attribute.value);
      });
      return false;
    }
    return !permanent;
  };
  var shouldMorphCallbacks = [
    verifyNotMutable,
    verifyNotPermanent,
    verifyNotContentEditable
  ];
  var didMorphCallbacks = [];

  // node_modules/morphdom/dist/morphdom-esm.js
  var DOCUMENT_FRAGMENT_NODE = 11;
  function morphAttrs(fromNode, toNode) {
    var toNodeAttrs = toNode.attributes;
    var attr;
    var attrName;
    var attrNamespaceURI;
    var attrValue;
    var fromValue;
    if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE || fromNode.nodeType === DOCUMENT_FRAGMENT_NODE) {
      return;
    }
    for (var i2 = toNodeAttrs.length - 1; i2 >= 0; i2--) {
      attr = toNodeAttrs[i2];
      attrName = attr.name;
      attrNamespaceURI = attr.namespaceURI;
      attrValue = attr.value;
      if (attrNamespaceURI) {
        attrName = attr.localName || attrName;
        fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName);
        if (fromValue !== attrValue) {
          if (attr.prefix === "xmlns") {
            attrName = attr.name;
          }
          fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
        }
      } else {
        fromValue = fromNode.getAttribute(attrName);
        if (fromValue !== attrValue) {
          fromNode.setAttribute(attrName, attrValue);
        }
      }
    }
    var fromNodeAttrs = fromNode.attributes;
    for (var d = fromNodeAttrs.length - 1; d >= 0; d--) {
      attr = fromNodeAttrs[d];
      attrName = attr.name;
      attrNamespaceURI = attr.namespaceURI;
      if (attrNamespaceURI) {
        attrName = attr.localName || attrName;
        if (!toNode.hasAttributeNS(attrNamespaceURI, attrName)) {
          fromNode.removeAttributeNS(attrNamespaceURI, attrName);
        }
      } else {
        if (!toNode.hasAttribute(attrName)) {
          fromNode.removeAttribute(attrName);
        }
      }
    }
  }
  var range;
  var NS_XHTML = "http://www.w3.org/1999/xhtml";
  var doc = typeof document === "undefined" ? void 0 : document;
  var HAS_TEMPLATE_SUPPORT = !!doc && "content" in doc.createElement("template");
  var HAS_RANGE_SUPPORT = !!doc && doc.createRange && "createContextualFragment" in doc.createRange();
  function createFragmentFromTemplate(str) {
    var template2 = doc.createElement("template");
    template2.innerHTML = str;
    return template2.content.childNodes[0];
  }
  function createFragmentFromRange(str) {
    if (!range) {
      range = doc.createRange();
      range.selectNode(doc.body);
    }
    var fragment = range.createContextualFragment(str);
    return fragment.childNodes[0];
  }
  function createFragmentFromWrap(str) {
    var fragment = doc.createElement("body");
    fragment.innerHTML = str;
    return fragment.childNodes[0];
  }
  function toElement(str) {
    str = str.trim();
    if (HAS_TEMPLATE_SUPPORT) {
      return createFragmentFromTemplate(str);
    } else if (HAS_RANGE_SUPPORT) {
      return createFragmentFromRange(str);
    }
    return createFragmentFromWrap(str);
  }
  function compareNodeNames(fromEl, toEl) {
    var fromNodeName = fromEl.nodeName;
    var toNodeName = toEl.nodeName;
    var fromCodeStart, toCodeStart;
    if (fromNodeName === toNodeName) {
      return true;
    }
    fromCodeStart = fromNodeName.charCodeAt(0);
    toCodeStart = toNodeName.charCodeAt(0);
    if (fromCodeStart <= 90 && toCodeStart >= 97) {
      return fromNodeName === toNodeName.toUpperCase();
    } else if (toCodeStart <= 90 && fromCodeStart >= 97) {
      return toNodeName === fromNodeName.toUpperCase();
    } else {
      return false;
    }
  }
  function createElementNS(name, namespaceURI) {
    return !namespaceURI || namespaceURI === NS_XHTML ? doc.createElement(name) : doc.createElementNS(namespaceURI, name);
  }
  function moveChildren(fromEl, toEl) {
    var curChild = fromEl.firstChild;
    while (curChild) {
      var nextChild = curChild.nextSibling;
      toEl.appendChild(curChild);
      curChild = nextChild;
    }
    return toEl;
  }
  function syncBooleanAttrProp(fromEl, toEl, name) {
    if (fromEl[name] !== toEl[name]) {
      fromEl[name] = toEl[name];
      if (fromEl[name]) {
        fromEl.setAttribute(name, "");
      } else {
        fromEl.removeAttribute(name);
      }
    }
  }
  var specialElHandlers = {
    OPTION: function(fromEl, toEl) {
      var parentNode = fromEl.parentNode;
      if (parentNode) {
        var parentName = parentNode.nodeName.toUpperCase();
        if (parentName === "OPTGROUP") {
          parentNode = parentNode.parentNode;
          parentName = parentNode && parentNode.nodeName.toUpperCase();
        }
        if (parentName === "SELECT" && !parentNode.hasAttribute("multiple")) {
          if (fromEl.hasAttribute("selected") && !toEl.selected) {
            fromEl.setAttribute("selected", "selected");
            fromEl.removeAttribute("selected");
          }
          parentNode.selectedIndex = -1;
        }
      }
      syncBooleanAttrProp(fromEl, toEl, "selected");
    },
    INPUT: function(fromEl, toEl) {
      syncBooleanAttrProp(fromEl, toEl, "checked");
      syncBooleanAttrProp(fromEl, toEl, "disabled");
      if (fromEl.value !== toEl.value) {
        fromEl.value = toEl.value;
      }
      if (!toEl.hasAttribute("value")) {
        fromEl.removeAttribute("value");
      }
    },
    TEXTAREA: function(fromEl, toEl) {
      var newValue = toEl.value;
      if (fromEl.value !== newValue) {
        fromEl.value = newValue;
      }
      var firstChild = fromEl.firstChild;
      if (firstChild) {
        var oldValue = firstChild.nodeValue;
        if (oldValue == newValue || !newValue && oldValue == fromEl.placeholder) {
          return;
        }
        firstChild.nodeValue = newValue;
      }
    },
    SELECT: function(fromEl, toEl) {
      if (!toEl.hasAttribute("multiple")) {
        var selectedIndex = -1;
        var i2 = 0;
        var curChild = fromEl.firstChild;
        var optgroup;
        var nodeName;
        while (curChild) {
          nodeName = curChild.nodeName && curChild.nodeName.toUpperCase();
          if (nodeName === "OPTGROUP") {
            optgroup = curChild;
            curChild = optgroup.firstChild;
          } else {
            if (nodeName === "OPTION") {
              if (curChild.hasAttribute("selected")) {
                selectedIndex = i2;
                break;
              }
              i2++;
            }
            curChild = curChild.nextSibling;
            if (!curChild && optgroup) {
              curChild = optgroup.nextSibling;
              optgroup = null;
            }
          }
        }
        fromEl.selectedIndex = selectedIndex;
      }
    }
  };
  var ELEMENT_NODE = 1;
  var DOCUMENT_FRAGMENT_NODE$1 = 11;
  var TEXT_NODE = 3;
  var COMMENT_NODE = 8;
  function noop() {
  }
  function defaultGetNodeKey(node) {
    if (node) {
      return node.getAttribute && node.getAttribute("id") || node.id;
    }
  }
  function morphdomFactory(morphAttrs2) {
    return function morphdom2(fromNode, toNode, options) {
      if (!options) {
        options = {};
      }
      if (typeof toNode === "string") {
        if (fromNode.nodeName === "#document" || fromNode.nodeName === "HTML" || fromNode.nodeName === "BODY") {
          var toNodeHtml = toNode;
          toNode = doc.createElement("html");
          toNode.innerHTML = toNodeHtml;
        } else {
          toNode = toElement(toNode);
        }
      }
      var getNodeKey = options.getNodeKey || defaultGetNodeKey;
      var onBeforeNodeAdded = options.onBeforeNodeAdded || noop;
      var onNodeAdded = options.onNodeAdded || noop;
      var onBeforeElUpdated = options.onBeforeElUpdated || noop;
      var onElUpdated = options.onElUpdated || noop;
      var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
      var onNodeDiscarded = options.onNodeDiscarded || noop;
      var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || noop;
      var childrenOnly = options.childrenOnly === true;
      var fromNodesLookup = Object.create(null);
      var keyedRemovalList = [];
      function addKeyedRemoval(key) {
        keyedRemovalList.push(key);
      }
      function walkDiscardedChildNodes(node, skipKeyedNodes) {
        if (node.nodeType === ELEMENT_NODE) {
          var curChild = node.firstChild;
          while (curChild) {
            var key = void 0;
            if (skipKeyedNodes && (key = getNodeKey(curChild))) {
              addKeyedRemoval(key);
            } else {
              onNodeDiscarded(curChild);
              if (curChild.firstChild) {
                walkDiscardedChildNodes(curChild, skipKeyedNodes);
              }
            }
            curChild = curChild.nextSibling;
          }
        }
      }
      function removeNode(node, parentNode, skipKeyedNodes) {
        if (onBeforeNodeDiscarded(node) === false) {
          return;
        }
        if (parentNode) {
          parentNode.removeChild(node);
        }
        onNodeDiscarded(node);
        walkDiscardedChildNodes(node, skipKeyedNodes);
      }
      function indexTree(node) {
        if (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
          var curChild = node.firstChild;
          while (curChild) {
            var key = getNodeKey(curChild);
            if (key) {
              fromNodesLookup[key] = curChild;
            }
            indexTree(curChild);
            curChild = curChild.nextSibling;
          }
        }
      }
      indexTree(fromNode);
      function handleNodeAdded(el) {
        onNodeAdded(el);
        var curChild = el.firstChild;
        while (curChild) {
          var nextSibling = curChild.nextSibling;
          var key = getNodeKey(curChild);
          if (key) {
            var unmatchedFromEl = fromNodesLookup[key];
            if (unmatchedFromEl && compareNodeNames(curChild, unmatchedFromEl)) {
              curChild.parentNode.replaceChild(unmatchedFromEl, curChild);
              morphEl(unmatchedFromEl, curChild);
            } else {
              handleNodeAdded(curChild);
            }
          } else {
            handleNodeAdded(curChild);
          }
          curChild = nextSibling;
        }
      }
      function cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey) {
        while (curFromNodeChild) {
          var fromNextSibling = curFromNodeChild.nextSibling;
          if (curFromNodeKey = getNodeKey(curFromNodeChild)) {
            addKeyedRemoval(curFromNodeKey);
          } else {
            removeNode(curFromNodeChild, fromEl, true);
          }
          curFromNodeChild = fromNextSibling;
        }
      }
      function morphEl(fromEl, toEl, childrenOnly2) {
        var toElKey = getNodeKey(toEl);
        if (toElKey) {
          delete fromNodesLookup[toElKey];
        }
        if (!childrenOnly2) {
          if (onBeforeElUpdated(fromEl, toEl) === false) {
            return;
          }
          morphAttrs2(fromEl, toEl);
          onElUpdated(fromEl);
          if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
            return;
          }
        }
        if (fromEl.nodeName !== "TEXTAREA") {
          morphChildren(fromEl, toEl);
        } else {
          specialElHandlers.TEXTAREA(fromEl, toEl);
        }
      }
      function morphChildren(fromEl, toEl) {
        var curToNodeChild = toEl.firstChild;
        var curFromNodeChild = fromEl.firstChild;
        var curToNodeKey;
        var curFromNodeKey;
        var fromNextSibling;
        var toNextSibling;
        var matchingFromEl;
        outer:
          while (curToNodeChild) {
            toNextSibling = curToNodeChild.nextSibling;
            curToNodeKey = getNodeKey(curToNodeChild);
            while (curFromNodeChild) {
              fromNextSibling = curFromNodeChild.nextSibling;
              if (curToNodeChild.isSameNode && curToNodeChild.isSameNode(curFromNodeChild)) {
                curToNodeChild = toNextSibling;
                curFromNodeChild = fromNextSibling;
                continue outer;
              }
              curFromNodeKey = getNodeKey(curFromNodeChild);
              var curFromNodeType = curFromNodeChild.nodeType;
              var isCompatible = void 0;
              if (curFromNodeType === curToNodeChild.nodeType) {
                if (curFromNodeType === ELEMENT_NODE) {
                  if (curToNodeKey) {
                    if (curToNodeKey !== curFromNodeKey) {
                      if (matchingFromEl = fromNodesLookup[curToNodeKey]) {
                        if (fromNextSibling === matchingFromEl) {
                          isCompatible = false;
                        } else {
                          fromEl.insertBefore(matchingFromEl, curFromNodeChild);
                          if (curFromNodeKey) {
                            addKeyedRemoval(curFromNodeKey);
                          } else {
                            removeNode(curFromNodeChild, fromEl, true);
                          }
                          curFromNodeChild = matchingFromEl;
                        }
                      } else {
                        isCompatible = false;
                      }
                    }
                  } else if (curFromNodeKey) {
                    isCompatible = false;
                  }
                  isCompatible = isCompatible !== false && compareNodeNames(curFromNodeChild, curToNodeChild);
                  if (isCompatible) {
                    morphEl(curFromNodeChild, curToNodeChild);
                  }
                } else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) {
                  isCompatible = true;
                  if (curFromNodeChild.nodeValue !== curToNodeChild.nodeValue) {
                    curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
                  }
                }
              }
              if (isCompatible) {
                curToNodeChild = toNextSibling;
                curFromNodeChild = fromNextSibling;
                continue outer;
              }
              if (curFromNodeKey) {
                addKeyedRemoval(curFromNodeKey);
              } else {
                removeNode(curFromNodeChild, fromEl, true);
              }
              curFromNodeChild = fromNextSibling;
            }
            if (curToNodeKey && (matchingFromEl = fromNodesLookup[curToNodeKey]) && compareNodeNames(matchingFromEl, curToNodeChild)) {
              fromEl.appendChild(matchingFromEl);
              morphEl(matchingFromEl, curToNodeChild);
            } else {
              var onBeforeNodeAddedResult = onBeforeNodeAdded(curToNodeChild);
              if (onBeforeNodeAddedResult !== false) {
                if (onBeforeNodeAddedResult) {
                  curToNodeChild = onBeforeNodeAddedResult;
                }
                if (curToNodeChild.actualize) {
                  curToNodeChild = curToNodeChild.actualize(fromEl.ownerDocument || doc);
                }
                fromEl.appendChild(curToNodeChild);
                handleNodeAdded(curToNodeChild);
              }
            }
            curToNodeChild = toNextSibling;
            curFromNodeChild = fromNextSibling;
          }
        cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey);
        var specialElHandler = specialElHandlers[fromEl.nodeName];
        if (specialElHandler) {
          specialElHandler(fromEl, toEl);
        }
      }
      var morphedNode = fromNode;
      var morphedNodeType = morphedNode.nodeType;
      var toNodeType = toNode.nodeType;
      if (!childrenOnly) {
        if (morphedNodeType === ELEMENT_NODE) {
          if (toNodeType === ELEMENT_NODE) {
            if (!compareNodeNames(fromNode, toNode)) {
              onNodeDiscarded(fromNode);
              morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI));
            }
          } else {
            morphedNode = toNode;
          }
        } else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) {
          if (toNodeType === morphedNodeType) {
            if (morphedNode.nodeValue !== toNode.nodeValue) {
              morphedNode.nodeValue = toNode.nodeValue;
            }
            return morphedNode;
          } else {
            morphedNode = toNode;
          }
        }
      }
      if (morphedNode === toNode) {
        onNodeDiscarded(fromNode);
      } else {
        if (toNode.isSameNode && toNode.isSameNode(morphedNode)) {
          return;
        }
        morphEl(morphedNode, toNode, childrenOnly);
        if (keyedRemovalList) {
          for (var i2 = 0, len = keyedRemovalList.length; i2 < len; i2++) {
            var elToRemove = fromNodesLookup[keyedRemovalList[i2]];
            if (elToRemove) {
              removeNode(elToRemove, elToRemove.parentNode, false);
            }
          }
        }
      }
      if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
        if (morphedNode.actualize) {
          morphedNode = morphedNode.actualize(fromNode.ownerDocument || doc);
        }
        fromNode.parentNode.replaceChild(morphedNode, fromNode);
      }
      return morphedNode;
    };
  }
  var morphdom = morphdomFactory(morphAttrs);
  var morphdom_esm_default = morphdom;

  // node_modules/cable_ready/javascript/operations.js
  var operations_default = {
    append: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { html, focusSelector } = operation;
          element.insertAdjacentHTML("beforeend", html || "");
          assignFocus(focusSelector);
        });
        after(element, operation);
      });
    },
    graft: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { parent, focusSelector } = operation;
          const parentElement = document.querySelector(parent);
          if (parentElement) {
            parentElement.appendChild(element);
            assignFocus(focusSelector);
          }
        });
        after(element, operation);
      });
    },
    innerHtml: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { html, focusSelector } = operation;
          element.innerHTML = html || "";
          assignFocus(focusSelector);
        });
        after(element, operation);
      });
    },
    insertAdjacentHtml: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { html, position, focusSelector } = operation;
          element.insertAdjacentHTML(position || "beforeend", html || "");
          assignFocus(focusSelector);
        });
        after(element, operation);
      });
    },
    insertAdjacentText: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { text, position, focusSelector } = operation;
          element.insertAdjacentText(position || "beforeend", text || "");
          assignFocus(focusSelector);
        });
        after(element, operation);
      });
    },
    morph: (operation) => {
      processElements(operation, (element) => {
        const { html } = operation;
        const template2 = document.createElement("template");
        template2.innerHTML = String(html).trim();
        operation.content = template2.content;
        const parent = element.parentElement;
        const ordinal = Array.from(parent.children).indexOf(element);
        before(element, operation);
        operate(operation, () => {
          const { childrenOnly, focusSelector } = operation;
          morphdom_esm_default(element, childrenOnly ? template2.content : template2.innerHTML, {
            childrenOnly: !!childrenOnly,
            onBeforeElUpdated: shouldMorph(operation),
            onElUpdated: didMorph(operation)
          });
          assignFocus(focusSelector);
        });
        after(parent.children[ordinal], operation);
      });
    },
    outerHtml: (operation) => {
      processElements(operation, (element) => {
        const parent = element.parentElement;
        const ordinal = Array.from(parent.children).indexOf(element);
        before(element, operation);
        operate(operation, () => {
          const { html, focusSelector } = operation;
          element.outerHTML = html || "";
          assignFocus(focusSelector);
        });
        after(parent.children[ordinal], operation);
      });
    },
    prepend: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { html, focusSelector } = operation;
          element.insertAdjacentHTML("afterbegin", html || "");
          assignFocus(focusSelector);
        });
        after(element, operation);
      });
    },
    remove: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { focusSelector } = operation;
          element.remove();
          assignFocus(focusSelector);
        });
        after(document, operation);
      });
    },
    replace: (operation) => {
      processElements(operation, (element) => {
        const parent = element.parentElement;
        const ordinal = Array.from(parent.children).indexOf(element);
        before(element, operation);
        operate(operation, () => {
          const { html, focusSelector } = operation;
          element.outerHTML = html || "";
          assignFocus(focusSelector);
        });
        after(parent.children[ordinal], operation);
      });
    },
    textContent: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { text, focusSelector } = operation;
          element.textContent = text || "";
          assignFocus(focusSelector);
        });
        after(element, operation);
      });
    },
    addCssClass: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { name } = operation;
          element.classList.add(...getClassNames(name || ""));
        });
        after(element, operation);
      });
    },
    removeAttribute: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { name } = operation;
          element.removeAttribute(name);
        });
        after(element, operation);
      });
    },
    removeCssClass: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { name } = operation;
          element.classList.remove(...getClassNames(name));
        });
        after(element, operation);
      });
    },
    setAttribute: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { name, value } = operation;
          element.setAttribute(name, value || "");
        });
        after(element, operation);
      });
    },
    setDatasetProperty: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { name, value } = operation;
          element.dataset[name] = value || "";
        });
        after(element, operation);
      });
    },
    setProperty: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { name, value } = operation;
          if (name in element)
            element[name] = value || "";
        });
        after(element, operation);
      });
    },
    setStyle: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { name, value } = operation;
          element.style[name] = value || "";
        });
        after(element, operation);
      });
    },
    setStyles: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { styles } = operation;
          for (let [name, value] of Object.entries(styles))
            element.style[name] = value || "";
        });
        after(element, operation);
      });
    },
    setValue: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { value } = operation;
          element.value = value || "";
        });
        after(element, operation);
      });
    },
    dispatchEvent: (operation) => {
      processElements(operation, (element) => {
        before(element, operation);
        operate(operation, () => {
          const { name, detail } = operation;
          dispatch2(element, name, detail);
        });
        after(element, operation);
      });
    },
    setMeta: (operation) => {
      before(document, operation);
      operate(operation, () => {
        const { name, content } = operation;
        let meta = document.head.querySelector(`meta[name='${name}']`);
        if (!meta) {
          meta = document.createElement("meta");
          meta.name = name;
          document.head.appendChild(meta);
        }
        meta.content = content;
      });
      after(document, operation);
    },
    clearStorage: (operation) => {
      before(document, operation);
      operate(operation, () => {
        const { type } = operation;
        const storage = type === "session" ? sessionStorage : localStorage;
        storage.clear();
      });
      after(document, operation);
    },
    go: (operation) => {
      before(window, operation);
      operate(operation, () => {
        const { delta } = operation;
        history.go(delta);
      });
      after(window, operation);
    },
    pushState: (operation) => {
      before(window, operation);
      operate(operation, () => {
        const { state, title, url: url2 } = operation;
        history.pushState(state || {}, title || "", url2);
      });
      after(window, operation);
    },
    redirectTo: (operation) => {
      before(window, operation);
      operate(operation, () => {
        let { url: url2, action } = operation;
        action = action || "advance";
        if (window.Turbo)
          window.Turbo.visit(url2, { action });
        if (window.Turbolinks)
          window.Turbolinks.visit(url2, { action });
        if (!window.Turbo && !window.Turbolinks)
          window.location.href = url2;
      });
      after(window, operation);
    },
    reload: (operation) => {
      before(window, operation);
      operate(operation, () => {
        window.location.reload();
      });
      after(window, operation);
    },
    removeStorageItem: (operation) => {
      before(document, operation);
      operate(operation, () => {
        const { key, type } = operation;
        const storage = type === "session" ? sessionStorage : localStorage;
        storage.removeItem(key);
      });
      after(document, operation);
    },
    replaceState: (operation) => {
      before(window, operation);
      operate(operation, () => {
        const { state, title, url: url2 } = operation;
        history.replaceState(state || {}, title || "", url2);
      });
      after(window, operation);
    },
    scrollIntoView: (operation) => {
      const { element } = operation;
      before(element, operation);
      operate(operation, () => {
        element.scrollIntoView(operation);
      });
      after(element, operation);
    },
    setCookie: (operation) => {
      before(document, operation);
      operate(operation, () => {
        const { cookie } = operation;
        document.cookie = cookie || "";
      });
      after(document, operation);
    },
    setFocus: (operation) => {
      const { element } = operation;
      before(element, operation);
      operate(operation, () => {
        assignFocus(element);
      });
      after(element, operation);
    },
    setStorageItem: (operation) => {
      before(document, operation);
      operate(operation, () => {
        const { key, value, type } = operation;
        const storage = type === "session" ? sessionStorage : localStorage;
        storage.setItem(key, value || "");
      });
      after(document, operation);
    },
    consoleLog: (operation) => {
      before(document, operation);
      operate(operation, () => {
        const { message, level } = operation;
        level && ["warn", "info", "error"].includes(level) ? console[level](message || "") : console.log(message || "");
      });
      after(document, operation);
    },
    consoleTable: (operation) => {
      before(document, operation);
      operate(operation, () => {
        const { data, columns } = operation;
        console.table(data, columns || []);
      });
      after(document, operation);
    },
    notification: (operation) => {
      before(document, operation);
      operate(operation, () => {
        const { title, options } = operation;
        Notification.requestPermission().then((result) => {
          operation.permission = result;
          if (result === "granted")
            new Notification(title || "", options);
        });
      });
      after(document, operation);
    }
  };

  // node_modules/cable_ready/javascript/operation_store.js
  var operations = operations_default;
  var add2 = (newOperations) => {
    operations = { ...operations, ...newOperations };
  };
  var addOperations = (operations2) => {
    add2(operations2);
  };
  var addOperation = (name, operation) => {
    const operations2 = {};
    operations2[name] = operation;
    add2(operations2);
  };
  var operation_store_default = {
    get all() {
      return operations;
    }
  };

  // node_modules/cable_ready/javascript/action_cable.js
  var consumer2;
  var wait = () => new Promise((resolve) => setTimeout(resolve));
  var retryGetConsumer = async () => {
    if (!consumer2) {
      await wait();
      return retryGetConsumer();
    } else {
      return consumer2;
    }
  };
  var action_cable_default = {
    setConsumer(value) {
      consumer2 = value;
    },
    async getConsumer() {
      return new Promise((resolve, reject) => {
        consumer2 = retryGetConsumer();
        resolve(consumer2);
      });
    }
  };

  // node_modules/cable_ready/javascript/elements/subscribing_element.js
  var SubscribingElement = class extends HTMLElement {
    disconnectedCallback() {
      if (this.channel)
        this.channel.unsubscribe();
    }
    createSubscription(consumer5, channel, receivedCallback) {
      this.channel = consumer5.subscriptions.create({
        channel,
        identifier: this.getAttribute("identifier")
      }, {
        received: receivedCallback
      });
    }
    get preview() {
      return document.documentElement.hasAttribute("data-turbolinks-preview") || document.documentElement.hasAttribute("data-turbo-preview");
    }
  };

  // node_modules/cable_ready/javascript/elements/stream_from_element.js
  var StreamFromElement = class extends SubscribingElement {
    async connectedCallback() {
      if (this.preview)
        return;
      const consumer5 = await javascript_default.consumer;
      if (consumer5) {
        this.createSubscription(consumer5, "CableReady::Stream", this.performOperations);
      } else {
        console.error("The `stream_from` helper cannot connect without an ActionCable consumer.\nPlease run `rails generate cable_ready:helpers` to fix this.");
      }
    }
    performOperations(data) {
      if (data.cableReady)
        javascript_default.perform(data.operations);
    }
  };

  // node_modules/cable_ready/javascript/elements/updates_for_element.js
  var template = `
<style>
  :host {
    display: block;
  }
</style>
<slot></slot>
`;
  function url(ele) {
    return ele.hasAttribute("url") ? ele.getAttribute("url") : location.href;
  }
  var UpdatesForElement = class extends SubscribingElement {
    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.innerHTML = template;
    }
    async connectedCallback() {
      if (this.preview)
        return;
      this.update = debounce2(this.update.bind(this), this.debounce);
      const consumer5 = await javascript_default.consumer;
      if (consumer5) {
        this.createSubscription(consumer5, "CableReady::Stream", this.update);
      } else {
        console.error("The `updates-for` helper cannot connect without an ActionCable consumer.\nPlease run `rails generate cable_ready:helpers` to fix this.");
      }
    }
    async update() {
      const identifier = this.getAttribute("identifier");
      const query = `updates-for[identifier="${identifier}"]`;
      const blocks = document.querySelectorAll(query);
      if (blocks[0] !== this)
        return;
      const html = {};
      const template2 = document.createElement("template");
      for (let i2 = 0; i2 < blocks.length; i2++) {
        blocks[i2].setAttribute("updating", "updating");
        if (!html.hasOwnProperty(url(blocks[i2]))) {
          const response = await fetch(url(blocks[i2]), {
            headers: {
              "X-Cable-Ready": "update"
            }
          }).then(handleErrors).catch((e2) => console.error(`Could not fetch ${url(blocks[i2])}`));
          if (response === void 0)
            return;
          html[url(blocks[i2])] = await response.text();
        }
        template2.innerHTML = String(html[url(blocks[i2])]).trim();
        const fragments = template2.content.querySelectorAll(query);
        if (fragments.length <= i2) {
          console.warn("Update aborted due to mismatched number of elements");
          return;
        }
        active_element_default.set(document.activeElement);
        const operation = {
          element: blocks[i2],
          html: fragments[i2],
          permanentAttributeName: "data-ignore-updates"
        };
        dispatch2(blocks[i2], "cable-ready:before-update", operation);
        morphdom_esm_default(blocks[i2], fragments[i2], {
          childrenOnly: true,
          onBeforeElUpdated: shouldMorph(operation),
          onElUpdated: (_) => {
            blocks[i2].removeAttribute("updating");
            dispatch2(blocks[i2], "cable-ready:after-update", operation);
            assignFocus(operation.focusSelector);
          }
        });
      }
    }
    get debounce() {
      return this.hasAttribute("debounce") ? parseInt(this.getAttribute("debounce")) : 20;
    }
  };

  // node_modules/cable_ready/javascript/cable_ready.js
  var perform = (operations2, options = { emitMissingElementWarnings: true }) => {
    const batches = {};
    operations2.forEach((operation) => {
      if (!!operation.batch)
        batches[operation.batch] = batches[operation.batch] ? ++batches[operation.batch] : 1;
    });
    operations2.forEach((operation) => {
      const name = operation.operation;
      try {
        if (operation.selector) {
          operation.element = operation.xpath ? xpathToElement(operation.selector) : document[operation.selectAll ? "querySelectorAll" : "querySelector"](operation.selector);
        } else {
          operation.element = document;
        }
        if (operation.element || options.emitMissingElementWarnings) {
          active_element_default.set(document.activeElement);
          const cableReadyOperation = operation_store_default.all[name];
          if (cableReadyOperation) {
            cableReadyOperation(operation);
            if (!!operation.batch && --batches[operation.batch] === 0)
              dispatch2(document, "cable-ready:batch-complete", {
                batch: operation.batch
              });
          } else {
            console.error(`CableReady couldn't find the "${name}" operation. Make sure you use the camelized form when calling an operation method.`);
          }
        }
      } catch (e2) {
        if (operation.element) {
          console.error(`CableReady detected an error in ${name}: ${e2.message}. If you need to support older browsers make sure you've included the corresponding polyfills. https://docs.stimulusreflex.com/setup#polyfills-for-ie11.`);
          console.error(e2);
        } else {
          console.warn(`CableReady ${name} failed due to missing DOM element for selector: '${operation.selector}'`);
        }
      }
    });
  };
  var performAsync = (operations2, options = { emitMissingElementWarnings: true }) => {
    return new Promise((resolve, reject) => {
      try {
        resolve(perform(operations2, options));
      } catch (err) {
        reject(err);
      }
    });
  };
  var initialize = (initializeOptions = {}) => {
    const { consumer: consumer5 } = initializeOptions;
    action_cable_default.setConsumer(consumer5);
    if (!customElements.get("stream-from"))
      customElements.define("stream-from", StreamFromElement);
    if (!customElements.get("updates-for"))
      customElements.define("updates-for", UpdatesForElement);
  };
  var consumer3 = action_cable_default.getConsumer();

  // node_modules/cable_ready/javascript/index.js
  var javascript_default = {
    perform,
    performAsync,
    shouldMorphCallbacks,
    didMorphCallbacks,
    initialize,
    consumer: consumer3,
    addOperation,
    addOperations,
    get DOMOperations() {
      console.warn("DEPRECATED: Please use `CableReady.operations` instead of `CableReady.DOMOperations`");
      return operation_store_default.all;
    },
    get operations() {
      return operation_store_default.all;
    }
  };

  // node_modules/stimulus_reflex/javascript/schema.js
  var defaultSchema2 = {
    reflexAttribute: "data-reflex",
    reflexPermanentAttribute: "data-reflex-permanent",
    reflexRootAttribute: "data-reflex-root",
    reflexDatasetAttribute: "data-reflex-dataset",
    reflexDatasetAllAttribute: "data-reflex-dataset-all",
    reflexSerializeFormAttribute: "data-reflex-serialize-form",
    reflexFormSelectorAttribute: "data-reflex-form-selector",
    reflexIncludeInnerHtmlAttribute: "data-reflex-include-inner-html",
    reflexIncludeTextContentAttribute: "data-reflex-include-text-content"
  };
  var schema = {};
  var schema_default = {
    set(application2) {
      schema = { ...defaultSchema2, ...application2.schema };
      for (const attribute in schema)
        Object.defineProperty(this, attribute.slice(0, -9), {
          get: () => {
            return schema[attribute];
          }
        });
    }
  };

  // node_modules/stimulus_reflex/javascript/isolation_mode.js
  var isolationMode = false;
  var isolation_mode_default = {
    get disabled() {
      return !isolationMode;
    },
    set(value) {
      isolationMode = value;
    }
  };

  // node_modules/stimulus_reflex/javascript/deprecate.js
  var deprecationWarnings = true;
  var deprecate_default = {
    get enabled() {
      return deprecationWarnings;
    },
    get disabled() {
      return !deprecationWarnings;
    },
    get value() {
      return deprecationWarnings;
    },
    set(value) {
      deprecationWarnings = !!value;
    },
    set deprecate(value) {
      deprecationWarnings = !!value;
    }
  };

  // node_modules/stimulus_reflex/javascript/attributes.js
  var multipleInstances = (element) => {
    if (["checkbox", "radio"].includes(element.type)) {
      return document.querySelectorAll(`input[type="${element.type}"][name="${element.name}"]`).length > 1;
    }
    return false;
  };
  var collectCheckedOptions = (element) => {
    return Array.from(element.querySelectorAll("option:checked")).concat(Array.from(document.querySelectorAll(`input[type="${element.type}"][name="${element.name}"]`)).filter((elem) => elem.checked)).map((o2) => o2.value);
  };
  var attributeValue = (values = []) => {
    const value = values.filter((v) => v && String(v).length).map((v) => v.trim()).join(" ").trim();
    return value.length ? value : null;
  };
  var attributeValues = (value) => {
    if (!value)
      return [];
    if (!value.length)
      return [];
    return value.split(" ").filter((v) => v.trim().length);
  };
  var extractElementAttributes = (element) => {
    let attrs = Array.from(element.attributes).reduce((memo, attr) => {
      memo[attr.name] = attr.value;
      return memo;
    }, {});
    attrs.checked = !!element.checked;
    attrs.selected = !!element.selected;
    attrs.tag_name = element.tagName;
    if (element.tagName.match(/select/i) || multipleInstances(element)) {
      const collectedOptions = collectCheckedOptions(element);
      attrs.values = collectedOptions;
      attrs.value = collectedOptions.join(",");
    } else {
      attrs.value = element.value;
    }
    return attrs;
  };
  var getElementsFromTokens = (element, tokens) => {
    if (!tokens || tokens.length === 0)
      return [];
    let elements = [element];
    const xPath = elementToXPath(element);
    tokens.forEach((token) => {
      try {
        switch (token) {
          case "combined":
            if (deprecate_default.enabled)
              console.warn("In the next version of StimulusReflex, the 'combined' option to data-reflex-dataset will become 'ancestors'.");
            elements = [
              ...elements,
              ...XPathToArray(`${xPath}/ancestor::*`, true)
            ];
            break;
          case "ancestors":
            elements = [
              ...elements,
              ...XPathToArray(`${xPath}/ancestor::*`, true)
            ];
            break;
          case "parent":
            elements = [...elements, ...XPathToArray(`${xPath}/parent::*`)];
            break;
          case "siblings":
            elements = [
              ...elements,
              ...XPathToArray(`${xPath}/preceding-sibling::*|${xPath}/following-sibling::*`)
            ];
            break;
          case "children":
            elements = [...elements, ...XPathToArray(`${xPath}/child::*`)];
            break;
          case "descendants":
            elements = [...elements, ...XPathToArray(`${xPath}/descendant::*`)];
            break;
          default:
            elements = [...elements, ...document.querySelectorAll(token)];
        }
      } catch (error4) {
        if (debug_default.enabled)
          console.error(error4);
      }
    });
    return elements;
  };
  var extractElementDataset = (element) => {
    const dataset = element.attributes[schema_default.reflexDataset];
    const allDataset = element.attributes[schema_default.reflexDatasetAll];
    const tokens = dataset && dataset.value.split(" ") || [];
    const allTokens = allDataset && allDataset.value.split(" ") || [];
    const datasetElements = getElementsFromTokens(element, tokens);
    const datasetAllElements = getElementsFromTokens(element, allTokens);
    const datasetAttributes = datasetElements.reduce((acc, ele) => {
      return { ...extractDataAttributes(ele), ...acc };
    }, {});
    const reflexElementAttributes = extractDataAttributes(element);
    const elementDataset = {
      dataset: { ...reflexElementAttributes, ...datasetAttributes },
      datasetAll: {}
    };
    datasetAllElements.forEach((element2) => {
      const elementAttributes = extractDataAttributes(element2);
      Object.keys(elementAttributes).forEach((key) => {
        const value = elementAttributes[key];
        if (elementDataset.datasetAll[key] && Array.isArray(elementDataset.datasetAll[key])) {
          elementDataset.datasetAll[key].push(value);
        } else {
          elementDataset.datasetAll[key] = [value];
        }
      });
    });
    return elementDataset;
  };
  var extractDataAttributes = (element) => {
    let attrs = {};
    if (element && element.attributes) {
      Array.from(element.attributes).forEach((attr) => {
        if (attr.name.startsWith("data-")) {
          attrs[attr.name] = attr.value;
        }
      });
    }
    return attrs;
  };

  // node_modules/stimulus_reflex/javascript/controllers.js
  var localReflexControllers = (app, element) => {
    return attributeValues(element.getAttribute(schema_default.controller)).reduce((memo, name) => {
      const controller = app.getControllerForElementAndIdentifier(element, name);
      if (controller && controller.StimulusReflex)
        memo.push(controller);
      return memo;
    }, []);
  };
  var allReflexControllers = (app, element) => {
    let controllers = [];
    while (element) {
      controllers = controllers.concat(localReflexControllers(app, element));
      element = element.parentElement;
    }
    return controllers;
  };
  var findControllerByReflexName = (reflexName, controllers) => {
    const controller = controllers.find((controller2) => {
      if (!controller2.identifier)
        return;
      return extractReflexName(reflexName).toLowerCase() === controller2.identifier.toLowerCase();
    });
    return controller || controllers[0];
  };

  // node_modules/stimulus_reflex/javascript/reflexes.js
  var reflexes = {};
  var received = (data) => {
    if (!data.cableReady)
      return;
    let reflexOperations = [];
    for (let i2 = data.operations.length - 1; i2 >= 0; i2--) {
      if (data.operations[i2].stimulusReflex) {
        reflexOperations.push(data.operations[i2]);
        data.operations.splice(i2, 1);
      }
    }
    if (reflexOperations.some((operation) => {
      return operation.stimulusReflex.url !== location.href;
    }))
      return;
    let reflexData;
    if (reflexOperations.length) {
      reflexData = reflexOperations[0].stimulusReflex;
      reflexData.payload = reflexOperations[0].payload;
    }
    if (reflexData) {
      const { reflexId, payload } = reflexData;
      if (!reflexes[reflexId] && isolation_mode_default.disabled) {
        const controllerElement = XPathToElement(reflexData.xpathController);
        const reflexElement = XPathToElement(reflexData.xpathElement);
        controllerElement.reflexController = controllerElement.reflexController || {};
        controllerElement.reflexData = controllerElement.reflexData || {};
        controllerElement.reflexError = controllerElement.reflexError || {};
        controllerElement.reflexController[reflexId] = reflexes.app.getControllerForElementAndIdentifier(controllerElement, reflexData.reflexController);
        controllerElement.reflexData[reflexId] = reflexData;
        dispatchLifecycleEvent("before", reflexElement, controllerElement, reflexId, payload);
        registerReflex(reflexData);
      }
      if (reflexes[reflexId]) {
        reflexes[reflexId].totalOperations = reflexOperations.length;
        reflexes[reflexId].pendingOperations = reflexOperations.length;
        reflexes[reflexId].completedOperations = 0;
        reflexes[reflexId].piggybackOperations = data.operations;
        javascript_default.perform(reflexOperations);
      }
    } else {
      if (data.operations.length && reflexes[data.operations[0].reflexId])
        javascript_default.perform(data.operations);
    }
  };
  var registerReflex = (data) => {
    const { reflexId } = data;
    reflexes[reflexId] = { finalStage: "finalize" };
    const promise = new Promise((resolve, reject) => {
      reflexes[reflexId].promise = {
        resolve,
        reject,
        data
      };
    });
    promise.reflexId = reflexId;
    if (debug_default.enabled)
      promise.catch(() => {
      });
    return promise;
  };
  var getReflexRoots = (element) => {
    let list = [];
    while (list.length === 0 && element) {
      let reflexRoot = element.getAttribute(schema_default.reflexRoot);
      if (reflexRoot) {
        if (reflexRoot.length === 0 && element.id)
          reflexRoot = `#${element.id}`;
        const selectors = reflexRoot.split(",").filter((s2) => s2.trim().length);
        if (debug_default.enabled && selectors.length === 0) {
          console.error(`No value found for ${schema_default.reflexRoot}. Add an #id to the element or provide a value for ${schema_default.reflexRoot}.`, element);
        }
        list = list.concat(selectors.filter((s2) => document.querySelector(s2)));
      }
      element = element.parentElement ? element.parentElement.closest(`[${schema_default.reflexRoot}]`) : null;
    }
    return list;
  };
  var setupDeclarativeReflexes = debounce(() => {
    document.querySelectorAll(`[${schema_default.reflex}]`).forEach((element) => {
      const controllers = attributeValues(element.getAttribute(schema_default.controller));
      const reflexAttributeNames = attributeValues(element.getAttribute(schema_default.reflex));
      const actions = attributeValues(element.getAttribute(schema_default.action));
      reflexAttributeNames.forEach((reflexName) => {
        const controller = findControllerByReflexName(reflexName, allReflexControllers(reflexes.app, element));
        let action;
        if (controller) {
          action = `${reflexName.split("->")[0]}->${controller.identifier}#__perform`;
          if (!actions.includes(action))
            actions.push(action);
        } else {
          action = `${reflexName.split("->")[0]}->stimulus-reflex#__perform`;
          if (!controllers.includes("stimulus-reflex")) {
            controllers.push("stimulus-reflex");
          }
          if (!actions.includes(action))
            actions.push(action);
        }
      });
      const controllerValue = attributeValue(controllers);
      const actionValue = attributeValue(actions);
      if (controllerValue && element.getAttribute(schema_default.controller) != controllerValue) {
        element.setAttribute(schema_default.controller, controllerValue);
      }
      if (actionValue && element.getAttribute(schema_default.action) != actionValue)
        element.setAttribute(schema_default.action, actionValue);
    });
    emitEvent("stimulus-reflex:ready");
  }, 20);
  var reflexes_default = reflexes;

  // node_modules/stimulus_reflex/javascript/lifecycle.js
  var invokeLifecycleMethod = (stage, reflexElement, controllerElement, reflexId, payload) => {
    if (!controllerElement || !controllerElement.reflexData[reflexId])
      return;
    const controller = controllerElement.reflexController[reflexId];
    const reflex = controllerElement.reflexData[reflexId].target;
    const reflexMethodName = reflex.split("#")[1];
    const specificLifecycleMethodName = ["before", "after", "finalize"].includes(stage) ? `${stage}${camelize3(reflexMethodName)}` : `${camelize3(reflexMethodName, false)}${camelize3(stage)}`;
    const specificLifecycleMethod = controller[specificLifecycleMethodName];
    const genericLifecycleMethodName = ["before", "after", "finalize"].includes(stage) ? `${stage}Reflex` : `reflex${camelize3(stage)}`;
    const genericLifecycleMethod = controller[genericLifecycleMethodName];
    if (typeof specificLifecycleMethod === "function") {
      specificLifecycleMethod.call(controller, reflexElement, reflex, controllerElement.reflexError[reflexId], reflexId, payload);
    }
    if (typeof genericLifecycleMethod === "function") {
      genericLifecycleMethod.call(controller, reflexElement, reflex, controllerElement.reflexError[reflexId], reflexId, payload);
    }
    if (reflexes_default[reflexId] && stage === reflexes_default[reflexId].finalStage) {
      Reflect.deleteProperty(controllerElement.reflexController, reflexId);
      Reflect.deleteProperty(controllerElement.reflexData, reflexId);
      Reflect.deleteProperty(controllerElement.reflexError, reflexId);
    }
  };
  document.addEventListener("stimulus-reflex:before", (event) => invokeLifecycleMethod("before", event.detail.element, event.detail.controller.element, event.detail.reflexId, event.detail.payload), true);
  document.addEventListener("stimulus-reflex:success", (event) => {
    invokeLifecycleMethod("success", event.detail.element, event.detail.controller.element, event.detail.reflexId, event.detail.payload);
    dispatchLifecycleEvent("after", event.detail.element, event.detail.controller.element, event.detail.reflexId, event.detail.payload);
  }, true);
  document.addEventListener("stimulus-reflex:nothing", (event) => {
    dispatchLifecycleEvent("success", event.detail.element, event.detail.controller.element, event.detail.reflexId, event.detail.payload);
  }, true);
  document.addEventListener("stimulus-reflex:error", (event) => {
    invokeLifecycleMethod("error", event.detail.element, event.detail.controller.element, event.detail.reflexId, event.detail.payload);
    dispatchLifecycleEvent("after", event.detail.element, event.detail.controller.element, event.detail.reflexId, event.detail.payload);
  }, true);
  document.addEventListener("stimulus-reflex:halted", (event) => invokeLifecycleMethod("halted", event.detail.element, event.detail.controller.element, event.detail.reflexId, event.detail.payload), true);
  document.addEventListener("stimulus-reflex:after", (event) => invokeLifecycleMethod("after", event.detail.element, event.detail.controller.element, event.detail.reflexId, event.detail.payload), true);
  document.addEventListener("stimulus-reflex:finalize", (event) => invokeLifecycleMethod("finalize", event.detail.element, event.detail.controller.element, event.detail.reflexId, event.detail.payload), true);
  var dispatchLifecycleEvent = (stage, reflexElement, controllerElement, reflexId, payload) => {
    if (!controllerElement) {
      if (debug_default.enabled && !reflexes_default[reflexId].warned) {
        console.warn(`StimulusReflex was not able execute callbacks or emit events for "${stage}" or later life-cycle stages for this Reflex. The StimulusReflex Controller Element is no longer present in the DOM. Could you move the StimulusReflex Controller to an element higher in your DOM?`);
        reflexes_default[reflexId].warned = true;
      }
      return;
    }
    if (!controllerElement.reflexController || controllerElement.reflexController && !controllerElement.reflexController[reflexId]) {
      if (debug_default.enabled && !reflexes_default[reflexId].warned) {
        console.warn(`StimulusReflex detected that the StimulusReflex Controller responsible for this Reflex has been replaced with a new instance. Callbacks and events for "${stage}" or later life-cycle stages cannot be executed.`);
        reflexes_default[reflexId].warned = true;
      }
      return;
    }
    const { target } = controllerElement.reflexData[reflexId] || {};
    const controller = controllerElement.reflexController[reflexId] || {};
    const event = `stimulus-reflex:${stage}`;
    const detail = {
      reflex: target,
      controller,
      reflexId,
      element: reflexElement,
      payload
    };
    controllerElement.dispatchEvent(new CustomEvent(event, { bubbles: true, cancelable: false, detail }));
    if (window.jQuery)
      window.jQuery(controllerElement).trigger(event, detail);
  };

  // node_modules/stimulus_reflex/javascript/log.js
  var request = (reflexId, target, args, controller, element, controllerElement) => {
    reflexes_default[reflexId].timestamp = new Date();
    console.log(`\u2191 stimulus \u2191 ${target}`, {
      reflexId,
      args,
      controller,
      element,
      controllerElement
    });
  };
  var success = (event, halted2) => {
    const { detail } = event || {};
    const { selector, payload } = detail || {};
    const { reflexId, target, morph } = detail.stimulusReflex || {};
    const reflex = reflexes_default[reflexId];
    const progress = reflex.totalOperations > 1 ? ` ${reflex.completedOperations}/${reflex.totalOperations}` : "";
    const duration = reflex.timestamp ? `in ${new Date() - reflex.timestamp}ms` : "CLONED";
    const operation = event.type.split(":")[1].split("-").slice(1).join("_");
    console.log(`\u2193 reflex \u2193 ${target} \u2192 ${selector || "\u221E"}${progress} ${duration}`, { reflexId, morph, operation, halted: halted2, payload });
  };
  var error2 = (event) => {
    const { detail } = event || {};
    const { reflexId, target, payload } = detail.stimulusReflex || {};
    const reflex = reflexes_default[reflexId];
    const duration = reflex.timestamp ? `in ${new Date() - reflex.timestamp}ms` : "CLONED";
    console.log(`\u2193 reflex \u2193 ${target} ${duration} %cERROR: ${event.detail.body}`, "color: #f00;", { reflexId, payload });
  };
  var log_default = { request, success, error: error2 };

  // node_modules/stimulus_reflex/javascript/callbacks.js
  var beforeDOMUpdate = (event) => {
    const { stimulusReflex, payload } = event.detail || {};
    if (!stimulusReflex)
      return;
    const { reflexId, xpathElement, xpathController } = stimulusReflex;
    const controllerElement = XPathToElement(xpathController);
    const reflexElement = XPathToElement(xpathElement);
    const reflex = reflexes_default[reflexId];
    const { promise } = reflex;
    reflex.pendingOperations--;
    if (reflex.pendingOperations > 0)
      return;
    if (!stimulusReflex.resolveLate)
      setTimeout(() => promise.resolve({
        element: reflexElement,
        event,
        data: promise.data,
        payload,
        reflexId,
        toString: () => ""
      }));
    setTimeout(() => dispatchLifecycleEvent("success", reflexElement, controllerElement, reflexId, payload));
  };
  var afterDOMUpdate = (event) => {
    const { stimulusReflex, payload } = event.detail || {};
    if (!stimulusReflex)
      return;
    const { reflexId, xpathElement, xpathController } = stimulusReflex;
    const controllerElement = XPathToElement(xpathController);
    const reflexElement = XPathToElement(xpathElement);
    const reflex = reflexes_default[reflexId];
    const { promise } = reflex;
    reflex.completedOperations++;
    if (debug_default.enabled)
      log_default.success(event, false);
    if (reflex.completedOperations < reflex.totalOperations)
      return;
    if (stimulusReflex.resolveLate)
      setTimeout(() => promise.resolve({
        element: reflexElement,
        event,
        data: promise.data,
        payload,
        reflexId,
        toString: () => ""
      }));
    setTimeout(() => dispatchLifecycleEvent("finalize", reflexElement, controllerElement, reflexId, payload));
    if (reflex.piggybackOperations.length)
      javascript_default.perform(reflex.piggybackOperations);
  };
  var routeReflexEvent = (event) => {
    const { stimulusReflex, payload, name, body } = event.detail || {};
    const eventType = name.split("-")[2];
    if (!stimulusReflex || !["nothing", "halted", "error"].includes(eventType))
      return;
    const { reflexId, xpathElement, xpathController } = stimulusReflex;
    const reflexElement = XPathToElement(xpathElement);
    const controllerElement = XPathToElement(xpathController);
    const reflex = reflexes_default[reflexId];
    const { promise } = reflex;
    if (controllerElement) {
      controllerElement.reflexError = controllerElement.reflexError || {};
      if (eventType === "error")
        controllerElement.reflexError[reflexId] = body;
    }
    switch (eventType) {
      case "nothing":
        nothing(event, payload, promise, reflex, reflexElement);
        break;
      case "error":
        error3(event, payload, promise, reflex, reflexElement);
        break;
      case "halted":
        halted(event, payload, promise, reflex, reflexElement);
        break;
    }
    setTimeout(() => dispatchLifecycleEvent(eventType, reflexElement, controllerElement, reflexId, payload));
    if (reflex.piggybackOperations.length)
      javascript_default.perform(reflex.piggybackOperations);
  };
  var nothing = (event, payload, promise, reflex, reflexElement) => {
    reflex.finalStage = "after";
    if (debug_default.enabled)
      log_default.success(event, false);
    setTimeout(() => promise.resolve({
      data: promise.data,
      element: reflexElement,
      event,
      payload,
      reflexId: promise.data.reflexId,
      toString: () => ""
    }));
  };
  var halted = (event, payload, promise, reflex, reflexElement) => {
    reflex.finalStage = "halted";
    if (debug_default.enabled)
      log_default.success(event, true);
    setTimeout(() => promise.resolve({
      data: promise.data,
      element: reflexElement,
      event,
      payload,
      reflexId: promise.data.reflexId,
      toString: () => ""
    }));
  };
  var error3 = (event, payload, promise, reflex, reflexElement) => {
    reflex.finalStage = "after";
    if (debug_default.enabled)
      log_default.error(event);
    setTimeout(() => promise.reject({
      data: promise.data,
      element: reflexElement,
      event,
      payload,
      reflexId: promise.data.reflexId,
      error: event.detail.body,
      toString: () => event.detail.body
    }));
  };

  // node_modules/stimulus_reflex/javascript/reflex_data.js
  var ReflexData = class {
    constructor(options, reflexElement, controllerElement, reflexController, permanentAttributeName, target, args, url2, tabId2) {
      this.options = options;
      this.reflexElement = reflexElement;
      this.controllerElement = controllerElement;
      this.reflexController = reflexController;
      this.permanentAttributeName = permanentAttributeName;
      this.target = target;
      this.args = args;
      this.url = url2;
      this.tabId = tabId2;
    }
    get attrs() {
      this._attrs = this._attrs || this.options["attrs"] || extractElementAttributes(this.reflexElement);
      return this._attrs;
    }
    get reflexId() {
      this._reflexId = this._reflexId || this.options["reflexId"] || uuidv4();
      return this._reflexId;
    }
    get selectors() {
      this._selectors = this._selectors || this.options["selectors"] || getReflexRoots(this.reflexElement);
      return typeof this._selectors === "string" ? [this._selectors] : this._selectors;
    }
    get resolveLate() {
      return this.options["resolveLate"] || false;
    }
    get dataset() {
      this._dataset = this._dataset || extractElementDataset(this.reflexElement);
      return this._dataset;
    }
    get innerHTML() {
      return this.includeInnerHtml ? this.reflexElement.innerHTML : "";
    }
    get textContent() {
      return this.includeTextContent ? this.reflexElement.textContent : "";
    }
    get xpathController() {
      return elementToXPath(this.controllerElement);
    }
    get xpathElement() {
      return elementToXPath(this.reflexElement);
    }
    get formSelector() {
      const attr = this.reflexElement.attributes[schema_default.reflexFormSelector] ? this.reflexElement.attributes[schema_default.reflexFormSelector].value : void 0;
      return this.options["formSelector"] || attr;
    }
    get includeInnerHtml() {
      const attr = this.reflexElement.attributes[schema_default.reflexIncludeInnerHtml] || false;
      return this.options["includeInnerHTML"] || attr ? attr.value !== "false" : false;
    }
    get includeTextContent() {
      const attr = this.reflexElement.attributes[schema_default.reflexIncludeTextContent] || false;
      return this.options["includeTextContent"] || attr ? attr.value !== "false" : false;
    }
    valueOf() {
      return {
        attrs: this.attrs,
        dataset: this.dataset,
        selectors: this.selectors,
        reflexId: this.reflexId,
        resolveLate: this.resolveLate,
        xpathController: this.xpathController,
        xpathElement: this.xpathElement,
        inner_html: this.innerHTML,
        text_content: this.textContent,
        formSelector: this.formSelector,
        reflexController: this.reflexController,
        permanentAttributeName: this.permanentAttributeName,
        target: this.target,
        args: this.args,
        url: this.url,
        tabId: this.tabId
      };
    }
  };

  // node_modules/stimulus_reflex/javascript/transports/action_cable.js
  var import_actioncable = __toModule(require_action_cable());
  var consumer4;
  var params;
  var subscriptionActive;
  var createSubscription = (controller) => {
    consumer4 = consumer4 || controller.application.consumer || (0, import_actioncable.createConsumer)();
    const { channel } = controller.StimulusReflex;
    const subscription = { channel, ...params };
    const identifier = JSON.stringify(subscription);
    controller.StimulusReflex.subscription = consumer4.subscriptions.findAll(identifier)[0] || consumer4.subscriptions.create(subscription, {
      received,
      connected,
      rejected,
      disconnected
    });
  };
  var connected = () => {
    subscriptionActive = true;
    document.body.classList.replace("stimulus-reflex-disconnected", "stimulus-reflex-connected");
    emitEvent("stimulus-reflex:connected");
    emitEvent("stimulus-reflex:action-cable:connected");
  };
  var rejected = () => {
    subscriptionActive = false;
    document.body.classList.replace("stimulus-reflex-connected", "stimulus-reflex-disconnected");
    emitEvent("stimulus-reflex:rejected");
    emitEvent("stimulus-reflex:action-cable:rejected");
    if (Debug.enabled)
      console.warn("Channel subscription was rejected.");
  };
  var disconnected = (willAttemptReconnect) => {
    subscriptionActive = false;
    document.body.classList.replace("stimulus-reflex-connected", "stimulus-reflex-disconnected");
    emitEvent("stimulus-reflex:disconnected", willAttemptReconnect);
    emitEvent("stimulus-reflex:action-cable:disconnected", willAttemptReconnect);
  };
  var action_cable_default2 = {
    consumer: consumer4,
    params,
    get subscriptionActive() {
      return subscriptionActive;
    },
    createSubscription,
    connected,
    rejected,
    disconnected,
    set(consumerValue, paramsValue) {
      consumer4 = consumerValue;
      params = paramsValue;
    }
  };

  // node_modules/stimulus_reflex/javascript/stimulus_reflex.js
  var StimulusReflexController = class extends Controller2 {
    constructor(...args) {
      super(...args);
      register(this);
    }
  };
  var initialize2 = (application2, { controller, consumer: consumer5, debug, params: params2, isolate, deprecate } = {}) => {
    action_cable_default2.set(consumer5, params2);
    document.addEventListener("DOMContentLoaded", () => {
      document.body.classList.remove("stimulus-reflex-connected");
      document.body.classList.add("stimulus-reflex-disconnected");
      if (deprecate_default.enabled && consumer5)
        console.warn("Deprecation warning: the next version of StimulusReflex will obtain a reference to consumer via the Stimulus application object.\nPlease add 'application.consumer = consumer' to your index.js after your Stimulus application has been established, and remove the consumer key from your StimulusReflex initialize() options object.");
      if (deprecate_default.enabled && isolation_mode_default.disabled)
        console.warn("Deprecation warning: the next version of StimulusReflex will standardize isolation mode, and the isolate option will be removed.\nPlease update your applications to assume that every tab will be isolated.");
    }, { once: true });
    isolation_mode_default.set(!!isolate);
    reflexes_default.app = application2;
    schema_default.set(application2);
    reflexes_default.app.register("stimulus-reflex", controller || StimulusReflexController);
    debug_default.set(!!debug);
    if (typeof deprecate !== "undefined")
      deprecate_default.set(deprecate);
    const observer = new MutationObserver(setupDeclarativeReflexes);
    observer.observe(document.documentElement, {
      attributeFilter: [schema_default.reflex, schema_default.action],
      childList: true,
      subtree: true
    });
  };
  var register = (controller, options = {}) => {
    const channel = "StimulusReflex::Channel";
    controller.StimulusReflex = { ...options, channel };
    action_cable_default2.createSubscription(controller);
    Object.assign(controller, {
      isActionCableConnectionOpen() {
        return this.StimulusReflex.subscription.consumer.connection.isOpen();
      },
      stimulate() {
        const url2 = location.href;
        const args = Array.from(arguments);
        const target = args.shift() || "StimulusReflex::Reflex#default_reflex";
        const controllerElement = this.element;
        const reflexElement = args[0] && args[0].nodeType === Node.ELEMENT_NODE ? args.shift() : controllerElement;
        if (reflexElement.type === "number" && reflexElement.validity && reflexElement.validity.badInput) {
          if (debug_default.enabled)
            console.warn("Reflex aborted: invalid numeric input");
          return;
        }
        const options2 = {};
        if (args[0] && typeof args[0] === "object" && Object.keys(args[0]).filter((key) => [
          "attrs",
          "selectors",
          "reflexId",
          "resolveLate",
          "serializeForm",
          "includeInnerHTML",
          "includeTextContent"
        ].includes(key)).length) {
          const opts = args.shift();
          Object.keys(opts).forEach((o2) => options2[o2] = opts[o2]);
        }
        const reflexData = new ReflexData(options2, reflexElement, controllerElement, this.identifier, schema_default.reflexPermanent, target, args, url2, tabId);
        const reflexId = reflexData.reflexId;
        if (!this.isActionCableConnectionOpen())
          throw "The ActionCable connection is not open! `this.isActionCableConnectionOpen()` must return true before calling `this.stimulate()`";
        if (!action_cable_default2.subscriptionActive)
          throw "The ActionCable channel subscription for StimulusReflex was rejected.";
        controllerElement.reflexController = controllerElement.reflexController || {};
        controllerElement.reflexData = controllerElement.reflexData || {};
        controllerElement.reflexError = controllerElement.reflexError || {};
        controllerElement.reflexController[reflexId] = this;
        controllerElement.reflexData[reflexId] = reflexData.valueOf();
        dispatchLifecycleEvent("before", reflexElement, controllerElement, reflexId);
        setTimeout(() => {
          const { params: params2 } = controllerElement.reflexData[reflexId] || {};
          const check = reflexElement.attributes[schema_default.reflexSerializeForm];
          if (check) {
            options2["serializeForm"] = check.value !== "false";
          }
          const form = reflexElement.closest(reflexData.formSelector) || document.querySelector(reflexData.formSelector) || reflexElement.closest("form");
          if (deprecate_default.enabled && options2["serializeForm"] === void 0 && form)
            console.warn(`Deprecation warning: the next version of StimulusReflex will not serialize forms by default.
Please set ${schema_default.reflexSerializeForm}="true" on your Reflex Controller Element or pass { serializeForm: true } as an option to stimulate.`);
          const formData = options2["serializeForm"] === false ? "" : serializeForm(form, {
            element: reflexElement
          });
          controllerElement.reflexData[reflexId] = {
            ...reflexData.valueOf(),
            params: params2,
            formData
          };
          this.StimulusReflex.subscription.send(controllerElement.reflexData[reflexId]);
        });
        const promise = registerReflex(reflexData.valueOf());
        if (debug_default.enabled) {
          log_default.request(reflexId, target, args, this.context.scope.identifier, reflexElement, controllerElement);
        }
        return promise;
      },
      __perform(event) {
        let element = event.target;
        let reflex;
        while (element && !reflex) {
          reflex = element.getAttribute(schema_default.reflex);
          if (!reflex || !reflex.trim().length)
            element = element.parentElement;
        }
        const match = attributeValues(reflex).find((reflex2) => reflex2.split("->")[0] === event.type);
        if (match) {
          event.preventDefault();
          event.stopPropagation();
          this.stimulate(match.split("->")[1], element);
        }
      }
    });
  };
  var tabId = uuidv4();
  var useReflex = (controller, options = {}) => {
    register(controller, options);
  };
  document.addEventListener("cable-ready:after-dispatch-event", routeReflexEvent);
  document.addEventListener("cable-ready:before-inner-html", beforeDOMUpdate);
  document.addEventListener("cable-ready:before-morph", beforeDOMUpdate);
  document.addEventListener("cable-ready:after-inner-html", afterDOMUpdate);
  document.addEventListener("cable-ready:after-morph", afterDOMUpdate);
  window.addEventListener("load", setupDeclarativeReflexes);
  var stimulus_reflex_default = {
    initialize: initialize2,
    register,
    useReflex,
    get debug() {
      return debug_default.value;
    },
    set debug(value) {
      debug_default.set(!!value);
    },
    get deprecate() {
      return deprecate_default.value;
    },
    set deprecate(value) {
      deprecate_default.set(!!value);
    }
  };

  // app/javascript/channels/consumer.js
  var import_actioncable2 = __toModule(require_action_cable());
  var consumer_default = (0, import_actioncable2.createConsumer)();

  // app/javascript/controllers/application_controller.js
  var application_controller_default = class extends Controller {
    connect() {
      stimulus_reflex_default.register(this);
    }
    beforeReflex(element, reflex, noop2, reflexId) {
    }
    reflexSuccess(element, reflex, noop2, reflexId) {
    }
    reflexError(element, reflex, error4, reflexId) {
    }
    reflexHalted(element, reflex, error4, reflexId) {
    }
    afterReflex(element, reflex, noop2, reflexId) {
    }
    finalizeReflex(element, reflex, noop2, reflexId) {
    }
  };

  // app/components/comments/form/component_controller.js
  var component_controller_default = class extends application_controller_default {
    connect() {
      super.connect();
    }
    create(event) {
      event.preventDefault();
      this.stimulate("Comments::Form::ComponentReflex#create", event.target);
      event.target.disabled = true;
    }
    update(event) {
      event.preventDefault();
      this.stimulate("Comments::Form::ComponentReflex#update", event.target);
      event.target.disabled = true;
    }
    createSuccess(element, reflex, noop2, reflexId) {
      var error_hint = this.formTarget.querySelector(".error");
      if (error_hint == null) {
        this.inputTarget.value = "";
      }
    }
  };
  __publicField(component_controller_default, "targets", ["input", "form"]);

  // app/components/scripts/card/component_controller.js
  var component_controller_default2 = class extends application_controller_default {
    copy(event) {
      event.target.parentNode.parentNode.children[0].click();
      if (document.selection) {
        var range2 = document.body.createTextRange();
        range2.moveToElementText(this.sourceTarget);
        range2.select();
      } else if (window.getSelection) {
        var range2 = document.createRange();
        range2.selectNode(this.sourceTarget);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range2);
      }
      document.execCommand("copy");
    }
  };
  __publicField(component_controller_default2, "targets", ["source"]);

  // app/components/categories/card/component_controller.js
  var component_controller_default3 = class extends application_controller_default {
    connect() {
      this.element.onmouseenter = () => {
        this.shake();
      };
    }
    shake() {
      this.iconTarget.setAttribute("style", "transition: 0.2s; transform: translateX(0px) translateY(0px) scale(1) rotate(-15deg) translateZ(0px);");
      setTimeout(() => {
        this.iconTarget.setAttribute("style", "transition: 0.2s; transform: translateX(0px) translateY(0px) scale(1) rotate(0deg) translateZ(0px);");
      }, 200);
    }
  };
  __publicField(component_controller_default3, "targets", ["icon"]);

  // app/javascript/controllers/avatar_preview_controller.js
  var avatar_preview_controller_default = class extends application_controller_default {
    connect() {
      this.update_image();
    }
    update_image() {
      var url2 = this.inputTarget.value;
      this.imgTarget.src = url2;
    }
  };
  __publicField(avatar_preview_controller_default, "targets", ["img", "input"]);

  // node_modules/tailwindcss-stimulus-components/dist/tailwindcss-stimulus-components.modern.js
  var s = class extends Controller {
    initialize() {
      this.hide();
    }
    connect() {
      setTimeout(() => {
        this.show();
      }, 200), this.hasDismissAfterValue && setTimeout(() => {
        this.close();
      }, this.dismissAfterValue);
    }
    close() {
      this.hide(), setTimeout(() => {
        this.element.remove();
      }, 1100);
    }
    show() {
      this.element.setAttribute("style", "transition: 1s; transform:translate(0, 0);");
    }
    hide() {
      this.element.setAttribute("style", "transition: 1s; transform:translate(400px, 0);");
    }
  };
  s.values = { dismissAfter: Number };
  var e = class extends Controller {
    connect() {
      this.timeout = null, this.duration = this.data.get("duration") || 1e3;
    }
    save() {
      clearTimeout(this.timeout), this.timeout = setTimeout(() => {
        this.statusTarget.textContent = "Saving...", Rails.fire(this.formTarget, "submit");
      }, this.duration);
    }
    success() {
      this.setStatus("Saved!");
    }
    error() {
      this.setStatus("Unable to save!");
    }
    setStatus(t) {
      this.statusTarget.textContent = t, this.timeout = setTimeout(() => {
        this.statusTarget.textContent = "";
      }, 2e3);
    }
  };
  e.targets = ["form", "status"];
  var i = class extends Controller {
    constructor(...t) {
      super(...t), this._onMenuButtonKeydown = (t2) => {
        switch (t2.keyCode) {
          case 13:
          case 32:
            t2.preventDefault(), this.toggle();
        }
      };
    }
    connect() {
      this.toggleClass = this.data.get("class") || "hidden", this.visibleClass = this.data.get("visibleClass") || null, this.invisibleClass = this.data.get("invisibleClass") || null, this.activeClass = this.data.get("activeClass") || null, this.enteringClass = this.data.get("enteringClass") || null, this.leavingClass = this.data.get("leavingClass") || null, this.hasButtonTarget && this.buttonTarget.addEventListener("keydown", this._onMenuButtonKeydown), this.element.setAttribute("aria-haspopup", "true");
    }
    disconnect() {
      this.hasButtonTarget && this.buttonTarget.removeEventListener("keydown", this._onMenuButtonKeydown);
    }
    toggle() {
      this.openValue = !this.openValue;
    }
    openValueChanged() {
      this.openValue ? this._show() : this._hide();
    }
    _show(t) {
      setTimeout((() => {
        this.menuTarget.classList.remove(this.toggleClass), this.element.setAttribute("aria-expanded", "true"), this._enteringClassList[0].forEach(((t2) => {
          this.menuTarget.classList.add(t2);
        }).bind(this)), this._activeClassList[0].forEach((t2) => {
          this.activeTarget.classList.add(t2);
        }), this._invisibleClassList[0].forEach((t2) => this.menuTarget.classList.remove(t2)), this._visibleClassList[0].forEach((t2) => {
          this.menuTarget.classList.add(t2);
        }), setTimeout((() => {
          this._enteringClassList[0].forEach((t2) => this.menuTarget.classList.remove(t2));
        }).bind(this), this.enterTimeout[0]), typeof t == "function" && t();
      }).bind(this));
    }
    _hide(t) {
      setTimeout((() => {
        this.element.setAttribute("aria-expanded", "false"), this._invisibleClassList[0].forEach((t2) => this.menuTarget.classList.add(t2)), this._visibleClassList[0].forEach((t2) => this.menuTarget.classList.remove(t2)), this._activeClassList[0].forEach((t2) => this.activeTarget.classList.remove(t2)), this._leavingClassList[0].forEach((t2) => this.menuTarget.classList.add(t2)), setTimeout((() => {
          this._leavingClassList[0].forEach((t2) => this.menuTarget.classList.remove(t2)), typeof t == "function" && t(), this.menuTarget.classList.add(this.toggleClass);
        }).bind(this), this.leaveTimeout[0]);
      }).bind(this));
    }
    show() {
      this.openValue = true;
    }
    hide(t) {
      this.element.contains(t.target) === false && this.openValue && (this.openValue = false);
    }
    get activeTarget() {
      return this.data.has("activeTarget") ? document.querySelector(this.data.get("activeTarget")) : this.element;
    }
    get _activeClassList() {
      return this.activeClass ? this.activeClass.split(",").map((t) => t.split(" ")) : [[], []];
    }
    get _visibleClassList() {
      return this.visibleClass ? this.visibleClass.split(",").map((t) => t.split(" ")) : [[], []];
    }
    get _invisibleClassList() {
      return this.invisibleClass ? this.invisibleClass.split(",").map((t) => t.split(" ")) : [[], []];
    }
    get _enteringClassList() {
      return this.enteringClass ? this.enteringClass.split(",").map((t) => t.split(" ")) : [[], []];
    }
    get _leavingClassList() {
      return this.leavingClass ? this.leavingClass.split(",").map((t) => t.split(" ")) : [[], []];
    }
    get enterTimeout() {
      return (this.data.get("enterTimeout") || "0,0").split(",").map((t) => parseInt(t));
    }
    get leaveTimeout() {
      return (this.data.get("leaveTimeout") || "0,0").split(",").map((t) => parseInt(t));
    }
  };
  i.targets = ["menu", "button"], i.values = { open: Boolean };
  var a = class extends Controller {
    connect() {
      this.toggleClass = this.data.get("class") || "hidden", this.backgroundId = this.data.get("backgroundId") || "modal-background", this.backgroundHtml = this.data.get("backgroundHtml") || this._backgroundHTML(), this.allowBackgroundClose = (this.data.get("allowBackgroundClose") || "true") === "true", this.preventDefaultActionOpening = (this.data.get("preventDefaultActionOpening") || "true") === "true", this.preventDefaultActionClosing = (this.data.get("preventDefaultActionClosing") || "true") === "true";
    }
    disconnect() {
      this.close();
    }
    open(t) {
      this.preventDefaultActionOpening && t.preventDefault(), t.target.blur && t.target.blur(), this.lockScroll(), this.containerTarget.classList.remove(this.toggleClass), this.data.get("disable-backdrop") || (document.body.insertAdjacentHTML("beforeend", this.backgroundHtml), this.background = document.querySelector(`#${this.backgroundId}`));
    }
    close(t) {
      t && this.preventDefaultActionClosing && t.preventDefault(), this.unlockScroll(), this.containerTarget.classList.add(this.toggleClass), this.background && this.background.remove();
    }
    closeBackground(t) {
      this.allowBackgroundClose && t.target === this.containerTarget && this.close(t);
    }
    closeWithKeyboard(t) {
      t.keyCode !== 27 || this.containerTarget.classList.contains(this.toggleClass) || this.close(t);
    }
    _backgroundHTML() {
      return `<div id="${this.backgroundId}" class="fixed top-0 left-0 w-full h-full" style="background-color: rgba(0, 0, 0, 0.8); z-index: 9998;"></div>`;
    }
    lockScroll() {
      const t = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${t}px`, this.saveScrollPosition(), document.body.classList.add("fixed", "inset-x-0", "overflow-hidden"), document.body.style.top = `-${this.scrollPosition}px`;
    }
    unlockScroll() {
      document.body.style.paddingRight = null, document.body.classList.remove("fixed", "inset-x-0", "overflow-hidden"), this.restoreScrollPosition(), document.body.style.top = null;
    }
    saveScrollPosition() {
      this.scrollPosition = window.pageYOffset || document.body.scrollTop;
    }
    restoreScrollPosition() {
      this.scrollPosition !== void 0 && (document.documentElement.scrollTop = this.scrollPosition);
    }
  };
  a.targets = ["container"];
  var l = class extends Controller {
    connect() {
      this.activeTabClasses = (this.data.get("activeTab") || "active").split(" "), this.inactiveTabClasses = (this.data.get("inactiveTab") || "inactive").split(" "), this.anchor && (this.index = this.tabTargets.findIndex((t) => t.id === this.anchor)), this.showTab();
    }
    change(t) {
      t.preventDefault(), this.index = t.currentTarget.dataset.index ? t.currentTarget.dataset.index : t.currentTarget.dataset.id ? this.tabTargets.findIndex((s2) => s2.id == t.currentTarget.dataset.id) : this.tabTargets.indexOf(t.currentTarget), window.dispatchEvent(new CustomEvent("tsc:tab-change"));
    }
    showTab() {
      this.tabTargets.forEach((t, s2) => {
        const e2 = this.panelTargets[s2];
        s2 === this.index ? (e2.classList.remove("hidden"), t.classList.remove(...this.inactiveTabClasses), t.classList.add(...this.activeTabClasses), t.id && (location.hash = t.id)) : (e2.classList.add("hidden"), t.classList.remove(...this.activeTabClasses), t.classList.add(...this.inactiveTabClasses));
      });
    }
    get index() {
      return parseInt(this.data.get("index") || 0);
    }
    set index(t) {
      this.data.set("index", t >= 0 ? t : 0), this.showTab();
    }
    get anchor() {
      return document.URL.split("#").length > 1 ? document.URL.split("#")[1] : null;
    }
  };
  l.targets = ["tab", "panel"];
  var n = class extends Controller {
    connect() {
      this.toggleClass = this.data.get("class") || "hidden";
    }
    toggle(t) {
      t.preventDefault(), this.openValue = !this.openValue;
    }
    hide(t) {
      t.preventDefault(), this.openValue = false;
    }
    show(t) {
      t.preventDefault(), this.openValue = true;
    }
    openValueChanged() {
      this.toggleClass && this.toggleableTargets.forEach((t) => {
        t.classList.toggle(this.toggleClass);
      });
    }
  };
  n.targets = ["toggleable"], n.values = { open: Boolean };
  var o = class extends Controller {
    initialize() {
      this.contentTarget.setAttribute("style", `transform:translate(${this.data.get("translateX")}, ${this.data.get("translateY")});`);
    }
    mouseOver() {
      this.contentTarget.classList.remove("hidden");
    }
    mouseOut() {
      this.contentTarget.classList.add("hidden");
    }
  };
  o.targets = ["content"];
  var r = class extends i {
    _show() {
      this.overlayTarget.classList.remove(this.toggleClass), super._show((() => {
        this._activeClassList[1].forEach((t) => this.overlayTarget.classList.add(t)), this._invisibleClassList[1].forEach((t) => this.overlayTarget.classList.remove(t)), this._visibleClassList[1].forEach((t) => this.overlayTarget.classList.add(t)), setTimeout((() => {
          this._enteringClassList[1].forEach((t) => this.overlayTarget.classList.remove(t));
        }).bind(this), this.enterTimeout[1]);
      }).bind(this));
    }
    _hide() {
      this._leavingClassList[1].forEach((t) => this.overlayTarget.classList.add(t)), super._hide((() => {
        setTimeout((() => {
          this._visibleClassList[1].forEach((t) => this.overlayTarget.classList.remove(t)), this._invisibleClassList[1].forEach((t) => this.overlayTarget.classList.add(t)), this._activeClassList[1].forEach((t) => this.overlayTarget.classList.remove(t)), this._leavingClassList[1].forEach((t) => this.overlayTarget.classList.remove(t)), this.overlayTarget.classList.add(this.toggleClass);
        }).bind(this), this.leaveTimeout[1]);
      }).bind(this));
    }
  };
  r.targets = ["menu", "overlay"];
  var h = class extends Controller {
    connect() {
      this.styleProperty = this.data.get("style") || "backgroundColor";
    }
    update() {
      this.preview = this.color;
    }
    set preview(t) {
      this.previewTarget.style[this.styleProperty] = t;
      const s2 = this._getContrastYIQ(t);
      this.styleProperty === "color" ? this.previewTarget.style.backgroundColor = s2 : this.previewTarget.style.color = s2;
    }
    get color() {
      return this.colorTarget.value;
    }
    _getContrastYIQ(t) {
      return t = t.replace("#", ""), (299 * parseInt(t.substr(0, 2), 16) + 587 * parseInt(t.substr(2, 2), 16) + 114 * parseInt(t.substr(4, 2), 16)) / 1e3 >= 128 ? "#000" : "#fff";
    }
  };
  h.targets = ["preview", "color"];

  // node_modules/stimulus-rails-nested-form/dist/stimulus-rails-nested-form.es.js
  function camelize4(value) {
    return value.replace(/(?:[_-])([a-z0-9])/g, (_, char) => char.toUpperCase());
  }
  function capitalize3(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  function dasherize3(value) {
    return value.replace(/([A-Z])/g, (_, char) => `-${char.toLowerCase()}`);
  }
  function readInheritableStaticArrayValues3(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor3(constructor);
    return Array.from(ancestors.reduce((values, constructor2) => {
      getOwnStaticArrayValues3(constructor2, propertyName).forEach((name) => values.add(name));
      return values;
    }, new Set()));
  }
  function readInheritableStaticObjectPairs3(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor3(constructor);
    return ancestors.reduce((pairs, constructor2) => {
      pairs.push(...getOwnStaticObjectPairs3(constructor2, propertyName));
      return pairs;
    }, []);
  }
  function getAncestorsForConstructor3(constructor) {
    const ancestors = [];
    while (constructor) {
      ancestors.push(constructor);
      constructor = Object.getPrototypeOf(constructor);
    }
    return ancestors.reverse();
  }
  function getOwnStaticArrayValues3(constructor, propertyName) {
    const definition = constructor[propertyName];
    return Array.isArray(definition) ? definition : [];
  }
  function getOwnStaticObjectPairs3(constructor, propertyName) {
    const definition = constructor[propertyName];
    return definition ? Object.keys(definition).map((key) => [key, definition[key]]) : [];
  }
  (() => {
    function extendWithReflect(constructor) {
      function extended() {
        return Reflect.construct(constructor, arguments, new.target);
      }
      extended.prototype = Object.create(constructor.prototype, {
        constructor: { value: extended }
      });
      Reflect.setPrototypeOf(extended, constructor);
      return extended;
    }
    function testReflectExtension() {
      const a2 = function() {
        this.a.call(this);
      };
      const b = extendWithReflect(a2);
      b.prototype.a = function() {
      };
      return new b();
    }
    try {
      testReflectExtension();
      return extendWithReflect;
    } catch (error4) {
      return (constructor) => class extended extends constructor {
      };
    }
  })();
  function ClassPropertiesBlessing3(constructor) {
    const classes = readInheritableStaticArrayValues3(constructor, "classes");
    return classes.reduce((properties, classDefinition) => {
      return Object.assign(properties, propertiesForClassDefinition3(classDefinition));
    }, {});
  }
  function propertiesForClassDefinition3(key) {
    return {
      [`${key}Class`]: {
        get() {
          const { classes } = this;
          if (classes.has(key)) {
            return classes.get(key);
          } else {
            const attribute = classes.getAttributeName(key);
            throw new Error(`Missing attribute "${attribute}"`);
          }
        }
      },
      [`${key}Classes`]: {
        get() {
          return this.classes.getAll(key);
        }
      },
      [`has${capitalize3(key)}Class`]: {
        get() {
          return this.classes.has(key);
        }
      }
    };
  }
  function TargetPropertiesBlessing3(constructor) {
    const targets = readInheritableStaticArrayValues3(constructor, "targets");
    return targets.reduce((properties, targetDefinition) => {
      return Object.assign(properties, propertiesForTargetDefinition3(targetDefinition));
    }, {});
  }
  function propertiesForTargetDefinition3(name) {
    return {
      [`${name}Target`]: {
        get() {
          const target = this.targets.find(name);
          if (target) {
            return target;
          } else {
            throw new Error(`Missing target element "${name}" for "${this.identifier}" controller`);
          }
        }
      },
      [`${name}Targets`]: {
        get() {
          return this.targets.findAll(name);
        }
      },
      [`has${capitalize3(name)}Target`]: {
        get() {
          return this.targets.has(name);
        }
      }
    };
  }
  function ValuePropertiesBlessing3(constructor) {
    const valueDefinitionPairs = readInheritableStaticObjectPairs3(constructor, "values");
    const propertyDescriptorMap = {
      valueDescriptorMap: {
        get() {
          return valueDefinitionPairs.reduce((result, valueDefinitionPair) => {
            const valueDescriptor = parseValueDefinitionPair3(valueDefinitionPair);
            const attributeName = this.data.getAttributeNameForKey(valueDescriptor.key);
            return Object.assign(result, { [attributeName]: valueDescriptor });
          }, {});
        }
      }
    };
    return valueDefinitionPairs.reduce((properties, valueDefinitionPair) => {
      return Object.assign(properties, propertiesForValueDefinitionPair3(valueDefinitionPair));
    }, propertyDescriptorMap);
  }
  function propertiesForValueDefinitionPair3(valueDefinitionPair) {
    const definition = parseValueDefinitionPair3(valueDefinitionPair);
    const { key, name, reader: read, writer: write } = definition;
    return {
      [name]: {
        get() {
          const value = this.data.get(key);
          if (value !== null) {
            return read(value);
          } else {
            return definition.defaultValue;
          }
        },
        set(value) {
          if (value === void 0) {
            this.data.delete(key);
          } else {
            this.data.set(key, write(value));
          }
        }
      },
      [`has${capitalize3(name)}`]: {
        get() {
          return this.data.has(key) || definition.hasCustomDefaultValue;
        }
      }
    };
  }
  function parseValueDefinitionPair3([token, typeDefinition]) {
    return valueDescriptorForTokenAndTypeDefinition3(token, typeDefinition);
  }
  function parseValueTypeConstant3(constant) {
    switch (constant) {
      case Array:
        return "array";
      case Boolean:
        return "boolean";
      case Number:
        return "number";
      case Object:
        return "object";
      case String:
        return "string";
    }
  }
  function parseValueTypeDefault3(defaultValue) {
    switch (typeof defaultValue) {
      case "boolean":
        return "boolean";
      case "number":
        return "number";
      case "string":
        return "string";
    }
    if (Array.isArray(defaultValue))
      return "array";
    if (Object.prototype.toString.call(defaultValue) === "[object Object]")
      return "object";
  }
  function parseValueTypeObject3(typeObject) {
    const typeFromObject = parseValueTypeConstant3(typeObject.type);
    if (typeFromObject) {
      const defaultValueType = parseValueTypeDefault3(typeObject.default);
      if (typeFromObject !== defaultValueType) {
        throw new Error(`Type "${typeFromObject}" must match the type of the default value. Given default value: "${typeObject.default}" as "${defaultValueType}"`);
      }
      return typeFromObject;
    }
  }
  function parseValueTypeDefinition3(typeDefinition) {
    const typeFromObject = parseValueTypeObject3(typeDefinition);
    const typeFromDefaultValue = parseValueTypeDefault3(typeDefinition);
    const typeFromConstant = parseValueTypeConstant3(typeDefinition);
    const type = typeFromObject || typeFromDefaultValue || typeFromConstant;
    if (type)
      return type;
    throw new Error(`Unknown value type "${typeDefinition}"`);
  }
  function defaultValueForDefinition3(typeDefinition) {
    const constant = parseValueTypeConstant3(typeDefinition);
    if (constant)
      return defaultValuesByType3[constant];
    const defaultValue = typeDefinition.default;
    if (defaultValue !== void 0)
      return defaultValue;
    return typeDefinition;
  }
  function valueDescriptorForTokenAndTypeDefinition3(token, typeDefinition) {
    const key = `${dasherize3(token)}-value`;
    const type = parseValueTypeDefinition3(typeDefinition);
    return {
      type,
      key,
      name: camelize4(key),
      get defaultValue() {
        return defaultValueForDefinition3(typeDefinition);
      },
      get hasCustomDefaultValue() {
        return parseValueTypeDefault3(typeDefinition) !== void 0;
      },
      reader: readers3[type],
      writer: writers3[type] || writers3.default
    };
  }
  var defaultValuesByType3 = {
    get array() {
      return [];
    },
    boolean: false,
    number: 0,
    get object() {
      return {};
    },
    string: ""
  };
  var readers3 = {
    array(value) {
      const array = JSON.parse(value);
      if (!Array.isArray(array)) {
        throw new TypeError("Expected array");
      }
      return array;
    },
    boolean(value) {
      return !(value == "0" || value == "false");
    },
    number(value) {
      return Number(value);
    },
    object(value) {
      const object = JSON.parse(value);
      if (object === null || typeof object != "object" || Array.isArray(object)) {
        throw new TypeError("Expected object");
      }
      return object;
    },
    string(value) {
      return value;
    }
  };
  var writers3 = {
    default: writeString3,
    array: writeJSON3,
    object: writeJSON3
  };
  function writeJSON3(value) {
    return JSON.stringify(value);
  }
  function writeString3(value) {
    return `${value}`;
  }
  var Controller3 = class {
    constructor(context) {
      this.context = context;
    }
    static get shouldLoad() {
      return true;
    }
    get application() {
      return this.context.application;
    }
    get scope() {
      return this.context.scope;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get targets() {
      return this.scope.targets;
    }
    get classes() {
      return this.scope.classes;
    }
    get data() {
      return this.scope.data;
    }
    initialize() {
    }
    connect() {
    }
    disconnect() {
    }
    dispatch(eventName, { target = this.element, detail = {}, prefix = this.identifier, bubbles = true, cancelable = true } = {}) {
      const type = prefix ? `${prefix}:${eventName}` : eventName;
      const event = new CustomEvent(type, { detail, bubbles, cancelable });
      target.dispatchEvent(event);
      return event;
    }
  };
  Controller3.blessings = [ClassPropertiesBlessing3, TargetPropertiesBlessing3, ValuePropertiesBlessing3];
  Controller3.targets = [];
  Controller3.values = {};
  var src_default = class extends Controller3 {
    add(e2) {
      e2.preventDefault();
      const content = this.templateTarget.innerHTML.replace(/NEW_RECORD/g, new Date().getTime().toString());
      this.targetTarget.insertAdjacentHTML("beforebegin", content);
    }
    remove(e2) {
      e2.preventDefault();
      const wrapper = e2.target.closest(this.wrapperSelectorValue);
      if (wrapper.dataset.newRecord === "true") {
        wrapper.remove();
      } else {
        wrapper.style.display = "none";
        const input = wrapper.querySelector("input[name*='_destroy']");
        input.value = "1";
      }
    }
  };
  src_default.targets = ["target", "template"];
  src_default.values = {
    wrapperSelector: {
      type: String,
      default: ".nested-form-wrapper"
    }
  };

  // app/javascript/controllers/index.js
  application.register("scripts--card--component", component_controller_default2);
  application.register("comments--form--component", component_controller_default);
  application.register("categories--card--component", component_controller_default3);
  application.register("avatar-preview", avatar_preview_controller_default);
  application.register("dropdown", i);
  application.register("alert", s);
  application.register("modal", a);
  application.register("nested-form", src_default);
  application.consumer = consumer_default;
  stimulus_reflex_default.initialize(application, { controller: application_controller_default, isolate: true });
  javascript_default.initialize({ consumer: consumer_default });

  // app/javascript/application.js
  var import_trix = __toModule(require_trix());

  // node_modules/@rails/actiontext/app/javascript/actiontext/attachment_upload.js
  var import_activestorage = __toModule(require_activestorage());
  var AttachmentUpload = class {
    constructor(attachment, element) {
      this.attachment = attachment;
      this.element = element;
      this.directUpload = new import_activestorage.DirectUpload(attachment.file, this.directUploadUrl, this);
    }
    start() {
      this.directUpload.create(this.directUploadDidComplete.bind(this));
    }
    directUploadWillStoreFileWithXHR(xhr) {
      xhr.upload.addEventListener("progress", (event) => {
        const progress = event.loaded / event.total * 100;
        this.attachment.setUploadProgress(progress);
      });
    }
    directUploadDidComplete(error4, attributes) {
      if (error4) {
        throw new Error(`Direct upload failed: ${error4}`);
      }
      this.attachment.setAttributes({
        sgid: attributes.attachable_sgid,
        url: this.createBlobUrl(attributes.signed_id, attributes.filename)
      });
    }
    createBlobUrl(signedId, filename) {
      return this.blobUrlTemplate.replace(":signed_id", signedId).replace(":filename", encodeURIComponent(filename));
    }
    get directUploadUrl() {
      return this.element.dataset.directUploadUrl;
    }
    get blobUrlTemplate() {
      return this.element.dataset.blobUrlTemplate;
    }
  };

  // node_modules/@rails/actiontext/app/javascript/actiontext/index.js
  addEventListener("trix-attachment-add", (event) => {
    const { attachment, target } = event;
    if (attachment.file) {
      const upload = new AttachmentUpload(attachment, target);
      upload.start();
    }
  });

  // app/javascript/trix-editor-overrides.js
  window.addEventListener("trix-file-accept", function(event) {
    const acceptedTypes = ["image/jpeg", "image/png"];
    const maxFileSize = 1024 * 1024 * 4;
    if (!acceptedTypes.includes(event.file.type)) {
      event.preventDefault();
      alert("Only support attachment of jpeg or png files");
    }
    if (event.file.size > maxFileSize) {
      event.preventDefault();
      alert("Only support attachment files upto size 4MB!");
    }
  });

  // app/javascript/application.js
  ActiveStorage.start();
  window.Turbo = turbo_es2017_esm_exports;
})();
