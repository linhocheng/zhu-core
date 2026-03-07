import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'alive', name: 'ZHU-CORE', order017: true, loop_alive: true });
}
