var Users = require('../models/users_model');
var Books = require('../models/books_log');
const Confirm = require('prompt-confirm');
const RNG = function (str) {
    for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353),
            h = h << 13 | h >>> 19;
    return function () {
        h = Math.imul(h ^ h >>> 16, 2246822507);
        h = Math.imul(h ^ h >>> 13, 3266489909);
        return (h ^= h >>> 16) >>> 0;
    }
}
module.exports.profile = function (req, res) {
    //var utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
    //console.log(utc)
    if (!req.query.q) {
        return res.render('userProfile');
    } else {
        Users.findOne({
            username: req.query.q
        },
            function (err, user) {
                if (err) {
                    console.log("Couldn't find the user");
                    return res.redirect('/user/profile');
                }
                console.log(user);
                return res.render('foreignProfile', {
                    fuser: user
                })
            }
        )

    }
}

module.exports.signup = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }

    return res.render('signUp');
}

module.exports.signin = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }

    return res.render('signIn');
}


module.exports.addUser = function (req, res) {
    if (req.body.pwd == req.body.cpwd) {
        Users.create({
            name: req.body.name,
            email: req.body.email,
            dob: req.body.dob,
            username: req.body.username,
            password: req.body.pwd,
            phno: req.body.phno,
            address: req.body.address
        }, function (err, user) {
            console.log(req.body);
            if (err) {
                console.log('Error adding user', err);
                return res.redirect('/users/sign-up');
            }
            console.log('New user added: ', user);
            return res.redirect('/users/sign-in');
        })
    } else {
        console.log("Password and Confirm Password fields not matching.");
        return res.redirect('back');
    }
}


module.exports.createSession = function (req, res) {
    return res.redirect('/users/profile');
}

module.exports.signout = function (req, res) {
    //passportjs adds logout function as callback to req method for easy session cookie timeout.
    req.logout();
    return res.redirect('/');
}







module.exports.rent = function (req, res) {
    //Count of number of elements
    let n = 0;
    Books.find({
        renter: req.user.id
    }).
        count(function (err, count) {
            if (err) { console.log(err); return res.redirect('back'); }
            else n = count;
        })
    //Populate and return the values
    var filter = req.query.filter;
    console.log(filter)

    var bnam = req.query.bnam;
    bnamregex = new RegExp(bnam, "gi");
    if (!filter) {

        Books.find({
            renter: req.user.id,
            bookname: bnamregex
        }).
            populate('renter').
            populate('borrower').
            populate('Validatedborrower').
            sort({
                borrowdate: -1
            }).
            exec(function (err, books) {
                if (err) {
                    console.log('Error fetching data');
                    return res.redirect('back');
                }
                return res.render('rent', {
                    books: books
                })
            })

    } else if (filter == "ret") {
        Books.find({
            renter: req.user.id,
            returned: true,
            bookname: bnamregex
        }).
            populate('renter').
            populate('borrower').
            populate('Validatedborrower').
            sort({
                borrowdate: -1
            }).
            exec(function (err, books) {
                if (err) {
                    console.log('Error fetching data');
                    return res.redirect('back');
                }
                return res.render('rent', {
                    books: books
                })
            })
    } else if (filter == "req") {
        Books.find({
            renter: req.user.id,
            borrower: {
                $ne: null
            },
            bookname: bnamregex
        }).
            populate('renter').
            populate('borrower').
            populate('Validatedborrower').
            sort({
                borrowdate: -1
            }).
            exec(function (err, books) {
                if (err) {
                    console.log('Error fetching data');
                    return res.redirect('back');
                }
                return res.render('rent', {
                    books: books
                })
            })
    } else if (filter == "ren") {
        Books.find({
            renter: req.user.id,
            Validatedborrower: {
                $ne: null
            },
            returned: false,
            bookname: bnamregex
        }).
            populate('renter').
            populate('borrower').
            populate('Validatedborrower').
            sort({
                borrowdate: -1
            }).
            exec(function (err, books) {
                if (err) {
                    console.log('Error fetching data');
                    return res.redirect('back');
                }
                return res.render('rent', {
                    books: books
                })
            })
    } else if (filter == "unr") {
        Books.find({
            renter: req.user.id,
            borrower: null,
            Validatedborrower: null,
            returned: false,
            bookname: bnamregex
        }).
            populate('renter').
            populate('borrower').
            populate('Validatedborrower').
            sort({
                borrowdate: -1
            }).
            exec(function (err, books) {
                if (err) {
                    console.log('Error fetching data');
                    return res.redirect('back');
                }
                return res.render('rent', {
                    books: books
                })
            })
    }
    // else{
    //     Books.find({
    //         renter: req.user.id
    //     }).
    //     populate('renter').
    //     populate('borrower').
    //     populate('Validatedborrower').
    //     sort({
    //         borrowdate: 1
    //     }).
    //     exec(function (err, books) {
    //         if (err) {
    //             console.log('Error fetching data');
    //         }
    //         return res.render('rent', {
    //             books: books
    //         })
    //     })
}


// Books.find({renter:req.user.id},function(err,books){
//     if(err){
//         console.log('Error fetching data');
//     }
//     console.log(books);
//     return res.render('rent',{
//         books: books
//     })
// })

//return res.render('rent');


module.exports.rentadd = function (req, res) {
    Books.create({
        bookname: req.body.bname,
        bookauthor: req.body.author,
        borrowprice: req.body.price,
        borrowduration: req.body.duration,
        compensationprice: req.body.cprice,
        phno: req.body.phno,
        description: req.body.desc,
        renter: req.body.renter,
    }, function (err, book) {
        console.log(req.body);
        if (err) {
            console.log('Error adding book', err);
            return res.redirect('/');
        }
        console.log('New book added: ', book);
        return res.redirect('back');
    })
}

module.exports.borrow = function (req, res) {
    var bnam = req.query.bnam;
    bnamregex = new RegExp(bnam, "gi");
    Books.find({
        bookname: bnamregex,
        borrower: null,
        Validatedborrower: null
    }).
        populate('renter').
        populate('borrower').
        populate('Validatedborrower').
        sort({
            borrowdate: -1
        }).
        exec(function (err, books) {
            if (err) {
                console.log('Error fetching data');
                return res.redirect('back');
            }

            return res.render('borrow', {
                books: books
            })
        })

    // Books.find({}).
    // populate('renter').
    // populate('borrower').exec(function (err, books) {
    //     if (err) {
    //         console.log('Error fetching data');
    //     }
    //     //console.log(books);
    //     //console.log(books[n-1].description);
    //     return res.render('borrow', {
    //         books: books
    //     })
    // })
}

module.exports.borrowal = function (req, res) {
    var utc = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
    console.log(utc);
    console.log(req.query);
    if (req.query.rid != req.user.id) {
        //console.log(req.query.rid +"  "+ req.user.id)
        Books.update({
            _id: req.query.book
        }, {
            $set: {
                borrower: req.user.id,
                borrowdate: utc,
                OTP: Math.floor(10000000 + Math.random() * (10000000 - 1000000))
            }
        }, {
            upsert: true
        }, function (err) {
            if (err) {
                console.log('Error updating data');
                return res.redirect('back');
            }
            //console.log(books);
            //console.log(books[n-1].description);
            return res.redirect('back');
        })
    } else {
        return res.redirect('back');
    }
}

module.exports.validate = function (req, res) {
    var utc = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
    var des = req.query.des;
    var vid = req.query.vid;
    var bid = req.query.bid;
    if (des == 'Y') {
        console.log("Validated");
        Books.update({
            _id: bid
        }, {
            $set: {
                Validatedborrower: vid,
                borrowdate: utc
            }
        }, {
            upsert: true
        }, function (err) {
            if (err) {
                console.log('Error updating data');
                return res.redirect('back');
            }
            //console.log(books);
        })
        Books.update({
            _id: bid
        }, {
            $set: {
                borrower: null
            }
        }, {
            upsert: true
        }, function (err) {
            if (err) {
                console.log('Error updating data');
                return res.redirect('back');
            }
            //console.log(books);
        })
        return res.redirect('back');
    } else {
        console.log("Declined");
        Books.update({
            _id: bid
        }, {
            $set: {
                borrower: null
            }
        }, {
            upsert: true
        }, function (err) {
            if (err) {
                console.log('Error updating data');
                return res.redirect('back');
            }
            //console.log(books);
        })
        return res.redirect('back');
    }
    return res.redirect('back');
}

module.exports.returnP = function (req, res) {
    var bnam = req.query.bnam;
    bnamregex = new RegExp(bnam, "gi");
    Books.find({
        Validatedborrower: req.user.id,
        bookname: bnamregex
    }).
        populate('renter').
        populate('borrower').
        populate('Validatedborrower').
        sort({
            returned: 1,
            borrowdate: 1
        }).
        exec(function (err, books) {
            if (err) {
                console.log('Error fetching data');
                return res.redirect('back');
            }
            return res.render('return.ejs', {
                books: books
            })
        })
    // Books.find({
    //     Validatedborrower: req.user.id
    // }).
    // populate('renter').
    // populate('borrower').
    // populate('Validatedborrower').
    // sort({
    //     returned: 1,
    //     borrowdate: 1
    // }).
    // exec(function (err, books) {
    //     if (err) {
    //         console.log('Error fetching data');
    //     }
    //     //console.log(books);
    //     //console.log(books[n-1].description);
    //     return res.render('return', {
    //         books: books
    //     })
    // })

    //return res.render('return');
}

module.exports.returnred = function (req, res) {
    var bookid = req.body.bookid;
    var OTP = req.body.OTP;
    var utc = new Date().toJSON().slice(0, 10).replace(/-/g, '/');


    Books.findById(bookid).
        populate('renter').
        populate('borrower').
        populate('Validatedborrower').
        exec(function (err, book) {
            if (err) {
                console.log('Error fetching data');
                return res.redirect('back');
            }
            console.log(book.OTP);

            if (OTP == book.OTP) {
                var bd = new Date(book.borrowdate.year, book.borrowdate.month, book.borrowdate.date);
                var td = new Date();
                td.setHours(0, 0, 0, 0);
                var dit = td.getTime() - bd.getTime();
                var did = dit / (1000 * 3600 * 24);
                console.log(did);
                var price = book.borrowprice;
                var duration = book.borrowduration;
                var tprice = 0;
                tprice += did * price;
                if (did - duration > 0)
                    tprice += (did - duration) * price;
                //console.log("did:"+did);
                // while (did > duration) {
                //     tprice += 2 * price * duration;
                //     did -= duration;
                // }
                // tprice += did * price;
                //console.log("did:"+did);
                //console.log("total:"+tprice);
                // console.log("bd: "+ bd);
                // console.log("td: "+ td);
                // console.log("did: "+ borrdate);
                Books.findByIdAndUpdate(bookid, {
                    returned: true,
                    returndate: utc,
                    total: tprice
                }, {
                    upsert: true,
                    useFindAndModify: false
                }, function (err1) {
                    if (err1) {
                        console.log('Error updating data');
                        return res.redirect('back');
                    }
                    console.log("RETURNED");
                    return res.redirect('back');
                })

            } else {
                console.log("NOT RETURNED");
                return res.redirect('back');
            }
        })
    // Books.findById(bookid, function(err,book){
    //     if(err){
    //         console.log('Error fetching data');
    //     }
    //     console.log(book.OTP);
    //     if( OTP==book.OTP){
    //         Books.findByIdAndUpdate(bookid, { returned: true}, {upsert: true, useFindAndModify: false}, function(err1){
    //             if(err1){
    //                 console.log('Error updating data');
    //             }
    //             console.log("RETURNED");
    //             return res.redirect('back');
    //         })

    //     }
    //     else{
    //         console.log("NOT RETURNED");
    //         return res.redirect('back');
    //     }
    // })
}

module.exports.upupdate = function (req, res) {
    //console.log(req.user);
    var arr = {
        'name': "",
        'email': "",
        'password': "",
        'username': "",
        'phno': "",
        'address': ""
    };
    arr.name = req.user.name;
    arr.email = req.user.email;
    arr.password = req.user.password;
    arr.username = req.user.username;
    arr.phno = req.user.phno;
    arr.address = req.user.address;
    //console.log(arr);
    return res.render('update_profile', {
        user: arr
    });
}
module.exports.update_data = async function (req, res) {
    // console.log(req.user);
    // return res.render('update_profile');
    if (req.user.password != req.body.pwd) {
        Users.update({
            _id: req.user.id
        }, {
            $set: {
                name: req.body.name,
                email: req.body.email,
                username: req.body.username,
                phno: req.body.phno,
                address: req.body.address
            }
        }, {
            upsert: true
        }, function (err) {
            if (err) {
                console.log('Error updating User data');
                return res.redirect('back');
            }
            //console.log(books);
            return res.redirect('/users/cp')
        })

    } else {
        Users.update({
            _id: req.user.id
        }, {
            $set: {
                name: req.body.name,
                email: req.body.email,
                username: req.body.username,
                phno: req.body.phno,
                address: req.body.address
            }
        }, {
            upsert: true
        }, function (err) {
            if (err) {
                console.log('Error updating User data');
                return res.redirect('back');
            }
            //console.log(books);
            return res.redirect('/users/profile');
        })
    }

}

module.exports.cp = function (req, res) {
    return res.render('cp');
}

module.exports.cpcheck = function (req, res) {
    if (req.body.currpwd != req.user.password) {
        console.log("Password mismatch");
        return;
    } else {
        Users.update({
            _id: req.user.id
        }, {
            $set: {
                password: req.body.newpwd
            }
        }, {
            upsert: true
        }, function (err) {
            if (err) {
                console.log('Error updating password');
                return res.redirect('back');
            }
            console.log("password update successful");
            return res.redirect('/users/profile');
        })
    }
}

module.exports.delete = (req, res) => {
    var bid = req.query.bd;
    Books.findById(bid).
        populate('renter').
        populate('borrower').
        populate('Validatedborrower').
        exec(function (err, book) {
            if (err) {
                console.log('Error deleting book');
                return res.redirect('back');
            }
            else {
                if (book.Validatedborrower == null && book.borrower == null && book.returned == false) {
                    Books.findByIdAndDelete(bid, function (err, docs) {
                        if (err) {
                            console.log(err);
                            return res.redirect('back');
                        }
                        else {
                            console.log("Deleted : ", docs);
                        }
                    });
                }
                return res.redirect('back');
            }
        })
}

module.exports.recommendation = (req, res) => {
    return res.render('recommendation')
}