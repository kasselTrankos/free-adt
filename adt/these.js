function These(a) {
    this.val = a
}

These.of = function(a) {
    return new These(a)
}

//  bind :: forall a b. m a -> (a -> m b) -> m b
These.prototype.bind = function(m) {
    return m(this.val)
}

// bindFlipped :: forall m a b. Bind m => (a -> m b) -> m a -> m b
These.prototype.bindFlipped = These.prototype['=<<'] = function(that) {
    return that.bind(this.val)
}

These.prototype.map = function(f){
    return These.of(f(this.val))
}

// apply :: forall a b. f (a -> b) -> f a -> f b
These.prototype.apply = function(a) {
    return These.of(this.val(a.val))
}

// -- | Collapse two applications of a monadic type constructor into one.
// join :: forall a m. Bind m => m (m a) -> m a
These.prototype.join = function() {
    return this.bind(x => x)
}

//fantasy-land/chainRec :: ChainRec m => ((a -> c, b -> c, a) -> m c, a) -> m b
These.prototype.chainrec = function(f, a) {
    
}


module.exports = These