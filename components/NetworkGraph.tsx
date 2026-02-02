import React, { useEffect, useRef } from 'react';
import { PROJECTS, CONNECTIONS, TOPICS, TOPIC_CONNECTIONS, TOPIC_WEIGHTS } from '../constants';

declare global {
  interface Window {
    p5: any;
  }
}

interface NetworkGraphProps {
  onNodeClick: (id: string | null) => void;
  activeId: string | null;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ onNodeClick, activeId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeIdRef = useRef(activeId);

  // Keep the ref updated so the p5 sketch can access the latest activeId without re-init
  useEffect(() => { activeIdRef.current = activeId; }, [activeId]);

  useEffect(() => {
    let p5Instance: any = null;
    let intervalId: any = null;
    let resizeObserver: ResizeObserver | null = null;

    const sketch = (p: any) => {
      let nodes: any[] = [];
      let springs: any[] = [];
      
      // Configuration
      const MAX_SPEED = 1.2;         
      const DRAG = 0.92;             
      const CENTER_GRAVITY = 0.002;  
      const REPULSION_STRENGTH = 6000; 
      const WALL_FORCE_STRENGTH = 5.0; 
      const WALL_DIST = 160;         
      const COLLISION_BOX_SCALE = 0.85; 
      const STIFFNESS = 0.01;        
      const BOUNCE_IMPULSE = 0.1;    
      
      // Bounds state
      let bounds = { minX: 0, maxX: 0, minY: 0, maxY: 0, cx: 0, cy: 0, anchorY: 0 };

      const updateBounds = () => {
        const w = p.width;
        const h = p.height;
        const isDesktop = window.innerWidth > 800;

        // Margins
        const marginLeft = isDesktop ? 120 : 40;
        const marginRight = isDesktop ? 140 : 40;
        
        // Cloud starts lower to give breathing room for the name
        const marginTop = 140; 
        // Anchor sits higher up
        const anchorMarginTop = 60;
        
        const marginBottom = 80;

        const safeMaxX = Math.max(marginLeft + 10, w - marginRight);
        const safeMaxY = Math.max(marginTop + 10, h - marginBottom);

        bounds = {
            minX: marginLeft,
            maxX: safeMaxX,
            minY: marginTop,
            maxY: safeMaxY,
            cx: w / 2,
            cy: h / 2,
            anchorY: anchorMarginTop
        };
      };

      class Node {
        id: string; label: string; type: string;
        pos: any; vel: any; acc: any;
        w: number; h: number; textSize: number;
        fixed: boolean = false;
        noiseX: number; noiseY: number;
        speedMult: number;

        constructor(id: string, label: string, type: string) {
          this.id = id; this.label = label; this.type = type;
          
          this.noiseX = p.random(10000);
          this.noiseY = p.random(10000);
          this.speedMult = p.random(0.5, 1.5); 
          
          this.vel = p.createVector(0,0);
          this.acc = p.createVector(0,0);

          if (type === 'anchor') {
             this.fixed = true;
             this.pos = p.createVector(bounds.minX, bounds.anchorY);
             this.updateDimensions(); // Calculate initial size
          } else if (type === 'project') {
             this.textSize = 18;
             this.pos = p.createVector(p.random(bounds.minX, bounds.maxX), p.random(bounds.minY, bounds.maxY));
             p.textSize(this.textSize);
             p.textStyle(p.BOLD);
             this.w = p.textWidth(this.label);
             this.h = this.textSize * 1.4;
          } else {
             const w = TOPIC_WEIGHTS[label] || 3;
             this.textSize = w === 2 ? 14 : w === 3 ? 12 : 10;
             this.pos = p.createVector(p.random(bounds.minX, bounds.maxX), p.random(bounds.minY, bounds.maxY));
             p.textSize(this.textSize);
             p.textStyle(p.NORMAL);
             this.w = p.textWidth(this.label);
             this.h = this.textSize * 1.4;
          }
        }

        updateDimensions() {
             if (this.type === 'anchor') {
                 // Anchor styling matching HTML: text-2xl (24px) or text-3xl (30px), Inter 300, uppercase, tracking-widest
                 const isLg = window.innerWidth > 1024;
                 this.textSize = isLg ? 30 : 24; 
                 
                 p.textSize(this.textSize);
                 p.textFont('Inter');
                 
                 // Manually transform to uppercase with Capital Sharp S (ẞ) for accurate width
                 const displayLabel = this.label.replace(/ß/g, 'ẞ').toUpperCase();
                 // 1.2 multiplier approximates the tracking-widest (0.1em) effect
                 this.w = p.textWidth(displayLabel) * 1.2; 
                 this.h = this.textSize * 1.5;
             }
        }

        applyForces() {
            if (this.fixed || !this.pos) return;

            // 1. Central Gravity
            const toCenter = p.createVector(bounds.cx - this.pos.x, bounds.cy - this.pos.y);
            this.acc.add(toCenter.mult(CENTER_GRAVITY));

            // 2. Soft Repulsive Wall Fields
            if (this.pos.x < bounds.minX + WALL_DIST) {
                let dist = this.pos.x - bounds.minX;
                let force = WALL_FORCE_STRENGTH * Math.pow((WALL_DIST - dist) / WALL_DIST, 2); 
                this.acc.x += Math.max(0, force); 
            }
            if (this.pos.x > bounds.maxX - WALL_DIST) {
                let dist = bounds.maxX - this.pos.x;
                let force = WALL_FORCE_STRENGTH * Math.pow((WALL_DIST - dist) / WALL_DIST, 2); 
                this.acc.x -= Math.max(0, force);
            }
            if (this.pos.y < bounds.minY + WALL_DIST) {
                let dist = this.pos.y - bounds.minY;
                let force = WALL_FORCE_STRENGTH * Math.pow((WALL_DIST - dist) / WALL_DIST, 2); 
                this.acc.y += Math.max(0, force);
            }
            if (this.pos.y > bounds.maxY - WALL_DIST) {
                let dist = bounds.maxY - this.pos.y;
                let force = WALL_FORCE_STRENGTH * Math.pow((WALL_DIST - dist) / WALL_DIST, 2); 
                this.acc.y -= Math.max(0, force);
            }

            // 3. Random Movement
            const t = p.frameCount * 0.003 * this.speedMult;
            const nX = p.map(p.noise(this.noiseX, t), 0, 1, -1, 1);
            const nY = p.map(p.noise(this.noiseY, t), 0, 1, -1, 1);
            this.acc.add(p.createVector(nX, nY).mult(0.08)); 

            // 4. Mouse Attraction
            if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
                const d = p.dist(p.mouseX, p.mouseY, this.pos.x, this.pos.y);
                const attractRange = 200; 
                if (d < attractRange) {
                    const attract = p.createVector(p.mouseX - this.pos.x, p.mouseY - this.pos.y);
                    attract.normalize();
                    attract.mult(0.8 * (1 - d/attractRange)); 
                    this.acc.add(attract);
                }
            }
        }

        update() {
            if (!this.pos) return;
            
            if (this.fixed) {
                this.pos.set(bounds.minX, bounds.anchorY);
                return;
            }

            this.vel.add(this.acc);
            this.vel.limit(MAX_SPEED);
            this.vel.mult(DRAG);
            this.pos.add(this.vel);
            this.acc.mult(0); 

            // 5. Hard Wall Bounce
            if (this.pos.x < bounds.minX) {
                this.pos.x = bounds.minX;
                this.vel.x *= -0.2; 
            }
            if (this.pos.x > bounds.maxX) {
                this.pos.x = bounds.maxX;
                this.vel.x *= -0.2;
            }
            if (this.pos.y < bounds.minY) {
                this.pos.y = bounds.minY;
                this.vel.y *= -0.2;
            }
            if (this.pos.y > bounds.maxY) {
                this.pos.y = bounds.maxY;
                this.vel.y *= -0.2;
            }
        }

        display() {
            if (!this.pos) return;
            
            p.push();
            const isActive = activeIdRef.current === this.id;
            const hasActive = !!activeIdRef.current;
            const isRelated = hasActive && isConnected(this.id, activeIdRef.current);
            
            let alpha = 255;
            if (hasActive && !isActive && !isRelated && this.type !== 'anchor') alpha = 60;
            
            p.translate(this.pos.x, this.pos.y);
            p.noStroke();
            
            if (this.type === 'anchor') {
                // Styling: "Alina Schmeiß" with Capital Sharp S (ẞ)
                // Matches CSS: text-2xl/3xl, font-light (300), tracking-widest (0.1em), uppercase, #FFD700
                
                // Use the textSize we calculated in updateDimensions to ensure consistency
                // but re-evaluate text size here just for drawing context in case it drifted (it shouldn't if updateDimensions is called correctly)
                const isLg = window.innerWidth > 1024;
                const fontSize = isLg ? 30 : 24;

                // We use native canvas context to get specific font weight and letter spacing
                // which standard p5 text() doesn't expose easily.
                p.drawingContext.save();
                p.drawingContext.font = `300 ${fontSize}px Inter, sans-serif`;
                p.drawingContext.letterSpacing = "0.1em"; // tracking-widest
                p.drawingContext.textAlign = "left";
                p.drawingContext.textBaseline = "middle";
                p.drawingContext.fillStyle = `rgba(255, 215, 0, ${alpha/255})`; // Gold #FFD700
                
                // Replace ß with ẞ and uppercase it manually
                const displayLabel = this.label.replace(/ß/g, 'ẞ').toUpperCase();
                p.drawingContext.fillText(displayLabel, 0, 0);
                p.drawingContext.restore();
            } else {
                // Regular styling for other nodes
                if (isActive) p.fill(255, 215, 0, alpha);
                else p.fill(255, alpha);
                
                p.textSize(this.textSize);
                p.textStyle(this.type === 'project' ? p.BOLD : p.NORMAL);
                p.textAlign(p.CENTER, p.CENTER);
                p.text(this.label, 0, 0);
            }
            
            p.pop();
        }
      }

      function applyGlobalRepulsion() {
          for (let i = 0; i < nodes.length; i++) {
              for (let j = i + 1; j < nodes.length; j++) {
                  let a = nodes[i];
                  let b = nodes[j];
                  if (!a || !b || !a.pos || !b.pos) continue; 
                  if (a.fixed && b.fixed) continue;

                  let dx = a.pos.x - b.pos.x;
                  let dy = a.pos.y - b.pos.y;
                  
                  if (a.type === 'anchor') dx = (a.pos.x + a.w/2) - b.pos.x;
                  if (b.type === 'anchor') dx = a.pos.x - (b.pos.x + b.w/2);

                  let dSq = dx*dx + dy*dy;
                  if (dSq < 1) dSq = 1;
                  
                  let dist = Math.sqrt(dSq);
                  let forceMag = REPULSION_STRENGTH / dSq;
                  forceMag = Math.min(forceMag, 5); 

                  let fx = (dx / dist) * forceMag;
                  let fy = (dy / dist) * forceMag;

                  if (!a.fixed) {
                      a.acc.x += fx;
                      a.acc.y += fy;
                  }
                  if (!b.fixed) {
                      b.acc.x -= fx;
                      b.acc.y -= fy;
                  }
              }
          }
      }

      function resolveCollisions() {
          for (let i = 0; i < nodes.length; i++) {
              for (let j = i + 1; j < nodes.length; j++) {
                  let a = nodes[i], b = nodes[j];
                  if (!a || !b || !a.pos || !b.pos) continue;
                  if (a.fixed && b.fixed) continue;

                  let ax = a.type === 'anchor' ? a.pos.x + a.w/2 : a.pos.x;
                  let ay = a.pos.y;
                  let bx = b.type === 'anchor' ? b.pos.x + b.w/2 : b.pos.x;
                  let by = b.pos.y;

                  let dx = bx - ax;
                  let dy = by - ay;
                  
                  let minW = ((a.w + b.w) / 2) * COLLISION_BOX_SCALE;
                  let minH = ((a.h + b.h) / 2) * COLLISION_BOX_SCALE;
                  
                  if (a.type === 'anchor' || b.type === 'anchor') {
                      minW *= 1.4; 
                      minH *= 1.4;
                  }

                  if (Math.abs(dx) < minW && Math.abs(dy) < minH) {
                      let ox = minW - Math.abs(dx);
                      let oy = minH - Math.abs(dy);

                      if (ox < oy) {
                          let move = ox * STIFFNESS; 
                          let dir = dx > 0 ? 1 : -1;
                          
                          if (!a.fixed) {
                              a.pos.x -= dir * move;
                              a.vel.x -= dir * BOUNCE_IMPULSE; 
                          }
                          if (!b.fixed) {
                              b.pos.x += dir * move;
                              b.vel.x += dir * BOUNCE_IMPULSE;
                          }
                      } else {
                          let move = oy * STIFFNESS;
                          let dir = dy > 0 ? 1 : -1;

                          if (!a.fixed) {
                              a.pos.y -= dir * move;
                              a.vel.y -= dir * BOUNCE_IMPULSE;
                          }
                          if (!b.fixed) {
                              b.pos.y += dir * move;
                              b.vel.y += dir * BOUNCE_IMPULSE;
                          }
                      }
                  }
              }
          }
      }

      function isConnected(idA: string, idB: string | null) {
          if (!idB) return false;
          return springs.some(s => (s.a.id === idA && s.b.id === idB) || (s.a.id === idB && s.b.id === idA));
      }

      p.setup = () => {
          // Double check canvas size
          const w = containerRef.current?.offsetWidth || 100;
          const h = containerRef.current?.offsetHeight || 100;
          p.createCanvas(w, h);
          updateBounds();
          
          nodes = []; springs = [];
          
          nodes.push(new Node("root", "Alina Schmeiß", "anchor"));

          PROJECTS.forEach(p => nodes.push(new Node(p.id, p.label, 'project')));
          
          TOPICS.forEach(t => {
             const hasLinks = PROJECTS.some(p => CONNECTIONS[p.id]?.includes(t)) || 
                              TOPIC_CONNECTIONS.some(tc => tc.source === t || tc.target === t);
             if (hasLinks) nodes.push(new Node(t, t, 'topic'));
          });

          const addLink = (id1: string, id2: string) => {
              const n1 = nodes.find(n => n.id === id1);
              const n2 = nodes.find(n => n.id === id2);
              if (n1 && n2) springs.push({a: n1, b: n2});
          };

          PROJECTS.forEach(p => addLink("root", p.id));
          nodes.filter(n => n.type === 'topic').forEach(t => {
              PROJECTS.forEach(p => {
                  if (CONNECTIONS[p.id]?.includes(t.label)) addLink(t.id, p.id);
              });
          });
          TOPIC_CONNECTIONS.forEach(tc => addLink(tc.source, tc.target));

          // Pre-Warm
          for(let i=0; i<300; i++) {
               applyGlobalRepulsion();
               nodes.forEach(n => { n.applyForces(); n.update(); });
               resolveCollisions();
          }
      };

      p.draw = () => {
          p.background("#004d4d");
          
          applyGlobalRepulsion(); 
          nodes.forEach(n => { n.applyForces(); n.update(); });
          resolveCollisions(); 

          const active = activeIdRef.current;
          springs.forEach(s => {
              if (!s.a.pos || !s.b.pos) return;
              const isRelevant = active && (s.a.id === active || s.b.id === active);
              
              const alpha = isRelevant ? 255 : 60; 
              p.stroke(255, 215, 0, alpha);
              
              p.strokeWeight(isRelevant ? 1.2 : 0.6);
              
              p.noFill();
              
              // Anchor lines start from right end of text (pos.x + w)
              // Others start from center (pos.x) as they are textAligned center
              // NOTE: s.a.w must be up to date.
              let ax = s.a.type === 'anchor' ? s.a.pos.x + s.a.w : s.a.pos.x;
              let bx = s.b.type === 'anchor' ? s.b.pos.x + s.b.w : s.b.pos.x;
              
              p.bezier(ax, s.a.pos.y, ax, s.a.pos.y + 30, bx, s.b.pos.y - 30, bx, s.b.pos.y);
          });

          let hovered = false;
          nodes.forEach(n => {
              n.display();
              if (n.pos) {
                  let cx = n.type === 'anchor' ? n.pos.x + n.w/2 : n.pos.x;
                  if (Math.abs(p.mouseX - cx) < n.w/2 && Math.abs(p.mouseY - n.pos.y) < n.h/2) {
                      hovered = true;
                  }
              }
          });
          p.cursor(hovered ? 'pointer' : 'default');
      };

      p.mousePressed = () => {
          if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) return;
          let clickedNode = false;
          
          for (let n of nodes) {
              if (!n.pos) continue;
              let cx = n.type === 'anchor' ? n.pos.x + n.w/2 : n.pos.x;
              if (Math.abs(p.mouseX - cx) < n.w/2 && Math.abs(p.mouseY - n.pos.y) < n.h/2) {
                  onNodeClick(n.type === 'anchor' ? null : n.id);
                  clickedNode = true;
                  break; 
              }
          }
          
          if (!clickedNode) {
              onNodeClick(null);
          }
      };
      
      p.windowResized = () => {
          if (containerRef.current) {
              p.resizeCanvas(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
              updateBounds();
              
              // Recalculate anchor dimensions and position immediately on resize
              const anchor = nodes.find(n => n.type === 'anchor');
              if (anchor) {
                 anchor.updateDimensions();
                 anchor.pos.set(bounds.minX, bounds.anchorY);
              }
          }
      };
    };

    const initP5 = () => {
        if (window.p5 && containerRef.current && containerRef.current.offsetWidth > 0) {
            if (intervalId) clearInterval(intervalId);
            if (p5Instance) p5Instance.remove();
            
            p5Instance = new window.p5(sketch, containerRef.current);
            
            // Setup ResizeObserver after p5 instance is created
            if (containerRef.current) {
                resizeObserver = new ResizeObserver(() => {
                    if (p5Instance) {
                        p5Instance.windowResized();
                    }
                });
                resizeObserver.observe(containerRef.current);
            }
        }
    };

    initP5();
    if (!p5Instance) {
        intervalId = setInterval(initP5, 200);
    }

    return () => {
        if (intervalId) clearInterval(intervalId);
        if (p5Instance) p5Instance.remove();
        if (resizeObserver) resizeObserver.disconnect();
    };
  }, [onNodeClick]); 

  return <div ref={containerRef} className="w-full h-full" />;
};

export default NetworkGraph;