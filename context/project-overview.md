# Project Overview

## Overview

A fun side project to build a chess game as a Turborepo monorepo. Web is the first platform, mobile comes later. Initial game is local two-player chess. Online multiplayer, authentication, friends, matchmaking, and ratings are future phases.

## Goals

1. Set up a clean monorepo architecture with Bun + Turborepo + TypeScript
2. Implement a working local two-player chess game on web
3. Keep core chess logic independent so it can be shared with mobile later
4. Build incrementally with proper feature specifications

## Core User Flow

1. User opens the web app
2. User sees the chessboard with pieces in starting position
3. User clicks a piece to select it
4. User clicks a valid square to move the piece
5. Turns alternate between white and black
6. Game detects check, checkmate, and draws
7. User can reset/restart the game

## Features

### Chess Game

- Classic 8x8 chessboard
- Standard piece placement
- Piece selection and movement
- Legal move validation
- Turn handling (white first)
- Piece captures
- Check detection
- Checkmate detection
- Draw detection (stalemate)
- Game reset/restart

### Future Phases

- Online multiplayer
- Authentication
- Friend requests
- Game rooms
- Match history
- Ratings

## Scope

### In Scope

- Monorepo setup with Bun + Turborepo
- Web app with React + TypeScript
- Shared chess logic package
- UI component package
- Feature specifications before implementation

### Out of Scope

- Backend infrastructure
- Authentication
- Online multiplayer
- Mobile app implementation
- Friend system
- Matchmaking

## Success Criteria

1. Monorepo builds successfully with `bun run build`
2. Web app runs with `bun run dev`
3. Chessboard renders correctly
4. Pieces can be selected and moved legally
5. Turn alternates between white and black
6. Check is detected and indicated
7. Checkmate ends the game
8. Draw (stalemate) is detected
9. Game can be reset
