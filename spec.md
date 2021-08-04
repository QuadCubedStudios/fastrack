# Spec

## Prelude

Lines:
1. Input points as coordinates. Style: `[[x,y],[x1,y1], ...]`
2. Output points as coordinates. Same style.
3. Lazy point values. Style: `[[x,y,b], ...]`

## Tracks

Can be one of the following(requires padding):
```
    
### 
   
```

```
 # 
 # 
 # 
```

```
 # 
## 
   
```

```
   
 ##
 # 
```

```
 # 
 ##
   
```

```
   
## 
 # 
```

## Lazy Points

The storage mechanism.

Requires a 1/0 starter value from Prelude. Possible TODO: May be moved to the tile itself.

Tile style:
```
 
#X#
 #
```
In any rotated form.

where `X` can be either `\` or `/`.

# Sprung points

The method of constructing subroutines.

Tile Style:
```

#Y#
 # 
```
In any rotated form.

Where `Y` can be in `^v<>`.

# Program end

When the train:
- reaches a dead end
- encounters an invalid track
- returns to the start point
it will immediately halt. 

 
