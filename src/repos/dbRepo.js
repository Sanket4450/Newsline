const domain = require('../models')

class DbRepo {
  static findOne(collectionName, queryObject) {
    return new Promise((resolve, reject) => {
      domain[collectionName]
        .findOne(queryObject.query, queryObject.data)
        .then((results) => {
          resolve(results)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  static create(collectionName, queryObject) {
    return new Promise((resolve, reject) => {
      domain[collectionName]
        .create(queryObject.data)
        .then((results) => {
          resolve(results)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  static updateOne(collectionName, queryObject) {
    return new Promise((resolve, reject) => {
      domain[collectionName]
        .updateOne(queryObject.query, queryObject.data, queryObject.options)
        .then((results) => {
          resolve(results)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  static updateMany(collectionName, queryObject) {
    return new Promise((resolve, reject) => {
      domain[collectionName]
        .updateMany(queryObject.query, queryObject.data, queryObject.options)
        .then((results) => {
          resolve(results)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  static deleteOne(collectionName, queryObject) {
    return new Promise((resolve, reject) => {
      domain[collectionName]
        .deleteOne(queryObject.query)
        .then((results) => {
          resolve(results)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  static deleteMany(collectionName, queryObject) {
    return new Promise((resolve, reject) => {
      domain[collectionName]
        .deleteMany(queryObject.query)
        .then((results) => {
          resolve(results)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  static find(collectionName, queryObject, sortQuery = {}) {
    return new Promise((resolve, reject) => {
      domain[collectionName]
        .find(queryObject.query, queryObject.data)
        .sort(sortQuery)
        .then((results) => {
          resolve(results)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  static findPage(collectionName, queryObject, sortQuery = {}, page, limit) {
    return new Promise((resolve, reject) => {
      domain[collectionName]
        .find(queryObject.query, queryObject.data)
        .sort(sortQuery)
        .skip((page - 1) * limit)
        .limit(limit)
        .then((results) => {
          resolve(results)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  static count(collectionName, queryObject) {
    return new Promise((resolve, reject) => {
      domain[collectionName]
        .countDocuments(queryObject.query)
        .then((results) => {
          resolve(results)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  static aggregate(collectionName, queryArray) {
    return new Promise((resolve, reject) => {
      domain[collectionName]
        .aggregate(queryArray)
        .then((results) => {
          resolve(results)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}

module.exports = DbRepo
