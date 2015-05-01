var express = require('express');
var bodyParser = require("body-parser");
var router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));

require('../models/systemprofile');

var mongoose = require('mongoose');
mongoose.set('debug', true)
var systemProfile = mongoose.model('SystemProfile');

router.get('/allcollections', function(req, res, next) {

  systemProfile
    .aggregate(
      [
        {
          $group: {
            _id: {'ns':'$ns'}
          }
        }
      ]
    )
    .exec(function(err, result) {
      if (err) {
        console.log('ERROR',err);
      }
      res.send(result);
    });

});

// router.get('/collection', function(req, res, next) {

//   systemProfile
//     .aggregate(
//       [
//         {
//           $group: {
//             _id: {'ns':'$ns'},
//             maxMillis: { $max: '$millis' },
//             avgMillis: { $avg: "$millis" },
//             minMillis: { $min: "$millis" },
//             count: { $sum: 1 },
//           }
//         }
//       ]
//     )
//     .exec(function(err, result) {
//       if (err) {
//         console.log('ERROR',err);
//       }
//       res.send(result);
//     });

// });

// router.get('/collectionoperation', function(req, res, next) {

//   systemProfile
//     .aggregate(
//       [
//         {
//           $group: {
//             _id: {'ns':'$ns', 'op':'$op'},
//             maxMillis: { $max: '$millis' },
//             avgMillis: { $avg: "$millis" },
//             minMillis: { $min: "$millis" },
//             count: { $sum: 1 },
//           }
//         }
//       ]
//     )
//     .exec(function(err, result) {
//       if (err) {
//         console.log('ERROR',err);
//       }
//       res.send(result);
//     });

// });

// router.get('/collection/:collection_name/operation', function(req, res, next) {

//   systemProfile
//     .aggregate(
//       [
//         { 
//           $match: { 
//             ns: { 
//               $eq: req.params.collection_name
//             }
//           }
//         },
//         {
//           $group: {
//             _id: {'op':'$op', 'query':'$query', 'updateobj':'$updateobj'},
//             maxMillis: { $max: '$millis' },
//             avgMillis: { $avg: "$millis" },
//             minMillis: { $min: "$millis" },
//             count: { $sum: 1 },
//           }
//         },
//         {
//           $sort: {
//             avgMillis: -1
//           }
//         },
//         {
//           $limit: 50
//         }
//       ]
//     )
//     .exec(function(err, result) {
//       if (err) {
//         console.log('ERROR',err);
//       }
//       res.send(result);
//     });

// });

router.get('/operationtime/:collection_name', function(req, res, next) {

  systemProfile
    .aggregate(
      [
        { 
          $match: { 
            ns: { 
              $eq: req.params.collection_name
            }
          }
        },
        {
          $project: {
            op: 1,
            millis: 1,
            query: {
              $cond: { if: { $eq: [ '$op', 'insert' ] }, then: 'yay', else: '$query' }
            }
          }
        },
        {
          $group: {
            _id: {'op':'$op', 'query':'$query'},
            maxMillis: { $max: '$millis' },
            avgMillis: { $avg: "$millis" },
            minMillis: { $min: "$millis" },
            count: { $sum: 1 },
          }
        },
        {
          $sort: {
            avgMillis: -1
          }
        },
        {
          $limit: 50
        }
      ]
    )
    .exec(function(err, result) {
      if (err) {
        console.log('ERROR',err);
      }
      res.send(result);
    });

});

router.get('/operationcount/:collection_name', function(req, res, next) {

  systemProfile
    .aggregate(
      [
        { 
          $match: { 
            ns: { 
              $eq: req.params.collection_name
            }
          }
        },
        {
          $project: {
            op: 1,
            millis: 1,
            query: {
              $cond: { if: { $eq: [ '$op', 'insert' ] }, then: 'yay', else: '$query' }
            }
          }
        },
        {
          $group: {
            _id: {'op':'$op', 'query':'$query'},
            maxMillis: { $max: '$millis' },
            avgMillis: { $avg: "$millis" },
            minMillis: { $min: "$millis" },
            count: { $sum: 1 },
          }
        },
        {
          $sort: {
            count: -1
          }
        },
        {
          $limit: 50
        }
      ]
    )
    .exec(function(err, result) {
      if (err) {
        console.log('ERROR',err);
      }
      res.send(result);
    });

});

router.get('/lastoperations/count/:collection_name', function(req, res, next) {

  systemProfile
    .aggregate(
      [
        { 
          $match: { 
            ns: { 
              $eq: req.params.collection_name
            }
          }
        },
        {
          $project: {
            op: 1,
            millis: 1,
            ts: 1,
            query: {
              $cond: { if: { $eq: [ '$op', 'insert' ] }, then: 'yay', else: '$query' }
            }
          }
        },
        {
          $group : {
            _id: {
              // op : '$op',
              // query: '$query',
              year : { $year : "$ts" },        
              month : { $month : "$ts" },        
              day : { $dayOfMonth : "$ts" }
            },
            maxMillis: { $max: '$millis' },
            avgMillis: { $avg: "$millis" },
            minMillis: { $min: "$millis" },
            count: { $sum: 1 }
          }
        },
        // { 
        //   $match: { 
        //     ns: { 
        //       $eq: req.params.collection_name
        //     }
        //   }
        // },
        // {
        //   $project: {
        //     op: 1,
        //     millis: 1,
        //     query: {
        //       $cond: { if: { $eq: [ '$op', 'insert' ] }, then: 'yay', else: '$query' }
        //     }
        //   }
        // },
        // {
        //   $group: {
        //     _id: {'op':'$op', 'query':'$query'},
        //     maxMillis: { $max: '$millis' },
        //     avgMillis: { $avg: "$millis" },
        //     minMillis: { $min: "$millis" },
        //     count: { $sum: 1 },
        //   }
        // },
        {
          $sort: {
            '_id.year': -1,
            '_id.month': -1,
            '_id.day': -1
          }
        // },
        // {
        //   $limit: 3
        }
      ]
    )
    .exec(function(err, result) {
      if (err) {
        console.log('ERROR',err);
      }
      console.log('RESULT', result);
      res.send(result);
    });

});

router.post('/collection/:collection_name/operation/id', function(req, res, next) {

  var operation = req.body.operation;
  var obj = req.body.obj;  // TODO at the moment only have query objs, so hardcoding - need to include updateobjs!!

  var systemProfileQuery = {
        ns: req.params.collection_name,
        op: operation
      };
  if(obj) {
    console.log("THERESANOBJ", obj);
    var parsed = JSON.parse(obj);
    console.log(parsed, parsed.path);
    systemProfileQuery['$where'] = "this.query && this.query.path && this.query.path === '" + parsed.path  + "'"//'/page9.js'"
  }

  console.log('HEREIT Is', systemProfileQuery);

  systemProfile
      .find(systemProfileQuery)
      .exec(function(err, result) {
        if(err) {
          console.log(err);
        }
        res.send(result);
      });
});

module.exports = router;