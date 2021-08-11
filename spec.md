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

Turns can be sharper, but it is recommended to keep all tracks 3x3 in order for readability.

## Lazy Points

The storage mechanism.

Requires a 1/0 starter value from Prelude.

Tile style:
```
 
P##
 #
```
In any rotated form.

where `P` stands for pushable. It is allowed to put it on either side. instead of being a switch, the train must push it till an intersection is reached, a slight complication over the original idea.

# Sprung points

The method of constructing subroutines.

Tile Style:
```

##S
 # 
```
In any rotated form.

Where `S` can be on any direction in the T.

# Program end

When the train:
- reaches a dead end
- encounters an invalid track
- returns to the start point
it will immediately halt. 

 
